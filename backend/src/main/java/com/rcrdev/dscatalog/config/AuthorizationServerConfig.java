package com.rcrdev.dscatalog.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;

@Configuration
@EnableAuthorizationServer //fazer com a classe represente o Authorization Server do Oauth
public class AuthorizationServerConfig extends AuthorizationServerConfigurerAdapter {

	//@value para ler as variaveis do arquivo de config (.properties) e repassar onde necessario
	@Value("${security.oauth2.client.client-id}")
	private String clientId;
	
	@Value("${security.oauth2.client.client-secret}")
	private String clientSecret;
	
	@Value("${jwt.duration}")
	private Integer jwtDuration;
	
	@Autowired
	private BCryptPasswordEncoder passwordEncoder;
	
	@Autowired
	private JwtAccessTokenConverter accessTokenConverter;
	
	@Autowired
	private JwtTokenStore tokenStore;
	
	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Override
	public void configure(AuthorizationServerSecurityConfigurer security) throws Exception {
		security.tokenKeyAccess("permitAll()").checkTokenAccess("isAuthenticated");
	}

	//define no ClientDetailsServiceConfigurer como vai ser a autenticacao e os dados da aplicacao(details) para geracao do token de autenticacao da aplicacao
	@Override
	public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
		clients.inMemory()
			.withClient(clientId) //nome da aplicacao. Depois no frontend devera ser informado essa informacao
			.secret(passwordEncoder.encode(clientSecret)) //senha da aplicacao
			.scopes("read", "write") //tipo de acesso que será dado
			.authorizedGrantTypes("password") //tipo de acesso
			.accessTokenValiditySeconds(jwtDuration); //tempo de expiracao do token (1dia)
	}

	//quem vai autorizar e qual é o formato do token aceito.
	@Override
	public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception {
		endpoints.authenticationManager(authenticationManager)
		.tokenStore(tokenStore) //responsavel por processar o token
		.accessTokenConverter(accessTokenConverter);
	}

	
}
