package com.rcrdev.dscatalog.components;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.TokenEnhancer;
import org.springframework.stereotype.Component;

import com.rcrdev.dscatalog.entities.User;
import com.rcrdev.dscatalog.repositories.UserRepository;

// classe que implementa o TokenEnhancer para poder adicionar mais informaçoes ao token JWT
@Component 
public class JwtTokenEnhancer implements TokenEnhancer {
	
	@Autowired
	private UserRepository userRepository;
	
	@Override
	public OAuth2AccessToken enhance(OAuth2AccessToken accessToken, OAuth2Authentication authentication) {
		User user = userRepository.findByEmail(authentication.getName()); //busca o usuario pelo email que esta no token
		
		Map<String, Object> map = new HashMap<>(); 
		map.put("userFirstName", user.getFirstName()); //insere no map o firstName e o ID do usuario recuperado
		map.put("userId", user.getId());
		
		DefaultOAuth2AccessToken token = (DefaultOAuth2AccessToken) accessToken;
		token.setAdditionalInformation(map);
		
		return accessToken;
	}

}
