package com.rcrdev.dscatalog.services.validation;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.HandlerMapping;

import com.rcrdev.dscatalog.dto.UserUpdateDTO;
import com.rcrdev.dscatalog.entities.User;
import com.rcrdev.dscatalog.repositories.UserRepository;
import com.rcrdev.dscatalog.resources.exceptions.FieldMessage;


// também boiler plate code
// interface generics, parametrizando o tipo da annotation e o tipo da classe que vai receber o annotation 
public class UserUpdateValidator implements ConstraintValidator<UserUpdateValid, UserUpdateDTO> {
	
	@Autowired
	private UserRepository repository;
	
	@Autowired
	private HttpServletRequest request; //objecto que guarda as informaçoes da requisicao http
	
	@Override
	public void initialize(UserUpdateValid ann) {
	} 
	
	// isValid é um método do ConstraintValidator que testa se o objeto UserInsertDTO é válido ou não, baseado na lógica abaixo
	@Override
	public boolean isValid(UserUpdateDTO dto, ConstraintValidatorContext context) {
		
		//var que guarda todas as variaveis passadas na URL da requisicao http
		@SuppressWarnings("unchecked")
		var uriVars = (Map<String,String>)request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE);
		
		//id é o {/id} definido no UserResource (update). Vai pegar o ID passado na URL
		long userId = Long.parseLong(uriVars.get("id"));
		
		List<FieldMessage> list = new ArrayList<>();
		
		// Coloque aqui seus testes de validação, acrescentando objetos FieldMessage à lista
		User user = repository.findByEmail(dto.getEmail());
		if (user != null && userId != user.getId()) {
			list.add(new FieldMessage("email", "email já cadastrado"));
		}
		
		//insere os items da lista de erro list no lista de erros do Beans Validation
		for (FieldMessage e : list) {
			context.disableDefaultConstraintViolation();
			context.buildConstraintViolationWithTemplate(e.getMessage()).addPropertyNode(e.getFieldName())
					.addConstraintViolation();
		}
		return list.isEmpty();
	}
}
