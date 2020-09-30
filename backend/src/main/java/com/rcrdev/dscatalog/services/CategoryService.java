package com.rcrdev.dscatalog.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rcrdev.dscatalog.dto.CategoryDTO;
import com.rcrdev.dscatalog.entities.Category;
import com.rcrdev.dscatalog.repositories.CategoryRepository;

@Service
public class CategoryService {

	@Autowired
	private CategoryRepository repository;

	@Transactional(readOnly = true)
	public List<CategoryDTO> findAll() {
		List<Category> list = repository.findAll();

		// to transform a List<Category> to List<CategoryDTO>
		return list.stream().map(x -> new CategoryDTO(x)).collect(Collectors.toList());
	}

}
