package com.rcrdev.dscatalog.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;

@Configuration
@EnableResourceServer
public class ResourceServerConfig extends ResourceServerConfigurerAdapter {

	//para liberar a rota do h2-console. environment é o ambiente de execucao da aplicacao. Com ele é possivel acessar varias informacoes
	@Autowired
	private Environment env;
	
	@Autowired
	private JwtTokenStore tokenStore;
	
	//Declaracao de constantes para definicao das rotas e nivel de acesso
	private static final String[] PUBLIC = { "/oauth/token" , "/h2-console/**"};
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

		//verifica o perfil de execucao da aplicacao e se for test, libera o acesso ao h2-console
		if (Arrays.asList(env.getActiveProfiles()).contains("test")) {
			http.headers().frameOptions().disable();
		}
		
		http.authorizeRequests()
			.antMatchers(PUBLIC).permitAll() //permite o acesso as rotas de PUBLIC a qualquer um
			.antMatchers(HttpMethod.GET, OPERATOR_OR_ADMIN).permitAll() //libera pra todo mundo somente o metodo GET das rotas do OPERATOR_OR_ADMIN
			.antMatchers(OPERATOR_OR_ADMIN).hasAnyRole("OPERATOR", "ADMIN") //libera tudo para quem tenha as roles de OPERATOR ou ADMIN
			.antMatchers(ADMIN).hasRole("ADMIN") //libera a rota de ADMIN somente para quem tem a role ADMIN
			.anyRequest().authenticated(); //qualquer outra rota, é preciso estar logado. Independente do perfil do usuario.
	}
	
	

}
