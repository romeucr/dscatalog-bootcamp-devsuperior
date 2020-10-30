package com.rcrdev.dscatalog.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;

@Configuration
@EnableResourceServer
public class ResourceServerConfig extends ResourceServerConfigurerAdapter {

	@Autowired
	private JwtTokenStore tokenStore;
	
	//Declaracao de constantes para definicao das rotas e nivel de acesso
	private static final String[] PUBLIC = { "/oauth/token" };
	private static final String[] OPERATOR_OR_ADMIN = { "/products/**", "/categories/**" };
	private static final String [] ADMIN = {"/users/**"};
	
	//configura a aceitacao do token
	@Override //com isso o ResourceServer vai ser capaz de analizar o token e dizer se é valido ou nao
	public void configure(ResourceServerSecurityConfigurer resources) throws Exception {
		resources.tokenStore(tokenStore);
	}

	//configura as rotas que devem ter privilegio de acesso.
	@Override
	public void configure(HttpSecurity http) throws Exception {
		
		http.authorizeRequests()
			.antMatchers(PUBLIC).permitAll() //permite o acesso as rotas de PUBLIC a qualquer um
			.antMatchers(HttpMethod.GET, OPERATOR_OR_ADMIN).permitAll() //libera pra todo mundo somente o metodo GET das rotas do OPERATOR_OR_ADMIN
			.antMatchers(OPERATOR_OR_ADMIN).hasAnyRole("OPERATOR", "ADMIN") //libera tudo para quem tenha as roles de OPERATOR ou ADMIN
			.antMatchers(ADMIN).hasRole("ADMIN") //libera a rota de ADMIN somente para quem tem a role ADMIN
			.anyRequest().authenticated(); //qualquer outra rota, é preciso estar logado. Independente do perfil do usuario.
	}
	
	

}
