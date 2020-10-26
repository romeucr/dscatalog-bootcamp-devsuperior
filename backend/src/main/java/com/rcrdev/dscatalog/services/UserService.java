package com.rcrdev.dscatalog.services;

import java.util.Optional;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rcrdev.dscatalog.dto.RoleDTO;
import com.rcrdev.dscatalog.dto.UserDTO;
import com.rcrdev.dscatalog.dto.UserInsertDTO;
import com.rcrdev.dscatalog.entities.Role;
import com.rcrdev.dscatalog.entities.User;
import com.rcrdev.dscatalog.repositories.RoleRepository;
import com.rcrdev.dscatalog.repositories.UserRepository;
import com.rcrdev.dscatalog.services.exceptions.DatabaseException;
import com.rcrdev.dscatalog.services.exceptions.ResourceNotFoundException;

@Service
public class UserService {

	@Autowired
	private UserRepository repository;
	
	@Autowired
	private RoleRepository roleRepository;
	
	@Autowired
	private BCryptPasswordEncoder passwordEncoder; //usado pra encodar a senha que vem no UserInsertDTO. Criado no AppConfig


	@Transactional(readOnly = true)
	public Page<UserDTO> findAllPaged(PageRequest pageRequest) {
		Page<User> list = repository.findAll(pageRequest);

		// to transform a List<User> to List<UserDTO>
		return list.map(x -> new UserDTO(x));
	}

	@Transactional(readOnly = true)
	public UserDTO findById(Long id) {
		Optional<User> obj = repository.findById(id); // findById returns an Optional.
		User entity = obj.orElseThrow(() -> new ResourceNotFoundException("Entity not Found")); // to get as User the Optional object
		return new UserDTO(entity);
	}

	@Transactional
	public UserDTO insert(UserInsertDTO dto) {
		User entity = new User();
		copyDtoToEntity(dto, entity);
		entity.setPassword(passwordEncoder.encode(dto.getPassword()));
		entity = repository.save(entity);
		return new UserDTO(entity);
	}

	@Transactional
	public UserDTO update(Long id, UserDTO dto) {
		try {
			User entity = repository.getOne(id); // .getOne() dont touch the DB. Instantiates a provisory object
													// with that ID. Just touch the DB when to save
			copyDtoToEntity(dto, entity);
			entity = repository.save(entity);
			return new UserDTO(entity);

		} catch (EntityNotFoundException e) {
			throw new ResourceNotFoundException("Id not found:" + id);
		}
	}

	public void delete(Long id) {
		try {
			repository.deleteById(id);
			
		} catch (EmptyResultDataAccessException e) {
			throw new ResourceNotFoundException("Id not found.");
		} catch (DataIntegrityViolationException e) { // integrity. in case that there are products with the category,
														// cant be deleted
			throw new DatabaseException("Integrity violaton.");
		}
	}

	// used to transform and DTO into Entity, avoiding to have to do entity.setXXX
	// every time. Obs: if one of the fields are null on update request, they will be saved like that!!!
	private void copyDtoToEntity(UserDTO dto, User entity) {
		entity.setFirstName(dto.getFirstName());
		entity.setLastName(dto.getLastName());
		entity.setEmail(dto.getEmail());
		
		entity.getRoles().clear();
		for (RoleDTO roleDto : dto.getRoles()) {
			Role role = roleRepository.getOne(roleDto.getId());
			entity.getRoles().add(role);
		}
	}

}
