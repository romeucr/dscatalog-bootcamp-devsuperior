package com.rcrdev.dscatalog.services;

import java.util.Optional;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rcrdev.dscatalog.dto.CategoryDTO;
import com.rcrdev.dscatalog.dto.ProductDTO;
import com.rcrdev.dscatalog.entities.Category;
import com.rcrdev.dscatalog.entities.Product;
import com.rcrdev.dscatalog.repositories.CategoryRepository;
import com.rcrdev.dscatalog.repositories.ProductRepository;
import com.rcrdev.dscatalog.services.exceptions.DatabaseException;
import com.rcrdev.dscatalog.services.exceptions.ResourceNotFoundException;

@Service
public class ProductService {

	@Autowired
	private ProductRepository repository;

	@Autowired
	private CategoryRepository categoryRepository;

	@Transactional(readOnly = true)
	public Page<ProductDTO> findAllPaged(PageRequest pageRequest) {
		Page<Product> list = repository.findAll(pageRequest);

		// to transform a List<Product> to List<ProductDTO>
		return list.map(x -> new ProductDTO(x));
	}

	@Transactional(readOnly = true)
	public ProductDTO findById(Long id) {
		Optional<Product> obj = repository.findById(id); // findById returns an Optional.
		Product entity = obj.orElseThrow(() -> new ResourceNotFoundException("Entity not Found")); // to get as
																									// Product the
																									// Optional object
		return new ProductDTO(entity, entity.getCategories());
	}

	@Transactional
	public ProductDTO insert(ProductDTO dto) {
		Product entity = new Product();
		copyDtoToEntity(dto, entity);
		entity = repository.save(entity);
		return new ProductDTO(entity);
	}

	@Transactional
	public ProductDTO update(Long id, ProductDTO dto) {

		try {
			Product entity = repository.getOne(id); // .getOne() dont touch the DB. Instantiates a provisory object
													// with that ID. Just touch the DB when to save
			copyDtoToEntity(dto, entity);
			entity = repository.save(entity);
			return new ProductDTO(entity);

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
	private void copyDtoToEntity(ProductDTO dto, Product entity) {
		entity.setName(dto.getName());
		entity.setDescription(dto.getDescription());
		entity.setDate(dto.getDate());
		entity.setImgUrl(dto.getImgUrl());
		entity.setPrice(dto.getPrice());

		entity.getCategories().clear(); // to clear categories in case that it has something

		for (CategoryDTO catDto : dto.getCategories()) {
			Category category = categoryRepository.getOne(catDto.getId());
			entity.getCategories().add(category);
		}
	}

}
