package com.rcrdev.dscatalog.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.rcrdev.dscatalog.entities.Category;
import com.rcrdev.dscatalog.entities.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>{

	@Query("SELECT DISTINCT obj FROM Product obj INNER JOIN obj.categories cats WHERE "  //categories is the Set<Category> in Product class
			+ "(COALESCE(:categories) IS NULL OR cats IN :categories) AND "
			+ "( LOWER(obj.name) LIKE LOWER(CONCAT('%',:name,'%')) )") //CONCAT to search %name%
	Page<Product> find(String name, List<Category> categories, Pageable pageable); //When the implementation of a paged response is implemented manually, we must use Pageable and not PageRequest

}
