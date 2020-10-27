package com.rcrdev.dscatalog.services.validation;

import java.util.ArrayList;
import java.util.List;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import org.springframework.beans.factory.annotation.Autowired;

import com.rcrdev.dscatalog.dto.UserInsertDTO;
import com.rcrdev.dscatalog.entities.User;
import com.rcrdev.dscatalog.repositories.UserRepository;
import com.rcrdev.dscatalog.resources.exceptions.FieldMessage;


// também boiler plate code
// interface generics, parametrizando o tipo da annotation e o tipo da classe que vai receber o annotation 
public class UserInsertValidator implements ConstraintValidator<UserInsertValid, UserInsertDTO> {
	
	@Autowired
	private UserRepository repository;
	
	@Override
	public void initialize(UserInsertValid ann) {
	}
	
	// isValid é um método do ConstraintValidator que testa se o objeto UserInsertDTO é válido ou não, baseado na lógica abaixo
	@Override
	public boolean isValid(UserInsertDTO dto, ConstraintValidatorContext context) {
		
		List<FieldMessage> list = new ArrayList<>();
		
		// Coloque aqui seus testes de validação, acrescentando objetos FieldMessage à lista
		User user = repository.findByEmail(dto.getEmail());
		if (user != null) {
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
