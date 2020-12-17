package com.rcrdev.dscatalog.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
	
	@Autowired
	private BCryptPasswordEncoder passwordEncoder;
	
	@Autowired
	private UserDetailsService userDetailsService;
	
	
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		//configurando como o Spring vai fazer a autenticacao do ususario
		//primeiro vai fazer a busca de usuário por email, implementada na userDetailsService
		//depois configura como será analisado o password, usendo o passwordEncoder
		auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
		super.configure(auth);
	}

	@Override
	public void configure(WebSecurity web) throws Exception {
		web.ignoring().antMatchers("/actuator/**"); //actuator é uma biblioteca usada pelo Spring Cloud Oauth para passar nas requisiçoes
		web.ignoring().antMatchers("/v2/api-docs", "/configuration/ui", "/swagger-resources/**", "/configuration/**", "/swagger-ui.html", "/webjars/**"); //autoriza a execucao do Swagger para geracao de documentacao das APIS

	}

	@Override
	@Bean //para que o objeto autehticationManager seja um componente disponivel no sistema. Ele é necessario na implementacao do Authorization Server. 
	protected AuthenticationManager authenticationManager() throws Exception {
		return super.authenticationManager();
	}
	
	

}
