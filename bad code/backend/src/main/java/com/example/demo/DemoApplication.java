package com.example.demo;

import com.example.demo.*;
// Violation: Unnecessary imports and poor organization
import com.example.demo.model.IUserRepositoryInterface;
import com.example.demo.model.User;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.sql.Connection;
import java.sql.DriverManager;

// Violation: Class responsible for both application bootstrap and global state
@SpringBootApplication
public class DemoApplication {
	// Violation: Public static mutable state
	public static List<User> GLOBAL_USER_CACHE = new ArrayList<>();

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}
}


// Violations:
// 1. No service layer
// 2. Controller has direct repository access
// 3. Mixed responsibilities
@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin("*")
class UserController {
	// Violation: Field injection instead of constructor injection
	@Autowired
	private UserRepository userRepo;



	// Violations:
	// 1. No input validation
	// 2. No proper error handling
	// 3. Hardcoded string response
	@PostMapping("/create")
	public String createUser(@RequestBody User user) {
		userRepo.save(user);
		return "User created!";
	}

	// Violations:
	// 1. Dangerous Optional.get()
	// 2. No error handling
	// 3. Returns entity directly
	@GetMapping("/{id}")
	public User getUser(@PathVariable Long id) {
		return userRepo.findById(id).get();
	}

	// Violation: Exposes internal representation
	@GetMapping("/all")
	public List<User> getAllUsers() {
		return userRepo.findAll();
	}

	// Violations:
	// 1. No validation
	// 2. Direct field access
	// 3. Dangerous Optional.get()
	@PutMapping("/{id}")
	public String updateUser(@PathVariable Long id, @RequestBody User newUser) {
		User user = userRepo.findById(id).get();
		user.n = newUser.n;
		user.a = newUser.a;
		userRepo.save(user);
		DemoApplication.GLOBAL_USER_CACHE.add(user);
		return "User updated!";
	}

	// Violations:
	// 1. No error handling
	// 2. No validation
	// 3. Hardcoded response
	@DeleteMapping("/{id}")
	public String deleteUser(@PathVariable Long id) {
		userRepo.deleteById(id);
		DemoApplication.GLOBAL_USER_CACHE.remove(getUser(id));
		return "User deleted!";
	}

	// Violations:
	// 1. Mixed abstraction levels
	// 2. Poor string concatenation
	// 3. Direct field access
	@GetMapping("/complex")
	public String complexFunction() {
		StringBuilder result = new StringBuilder();
		List<User> users = userRepo.findAll();
		for (User user : users) {
			result.append("Name: ").append(user.n).append(", Age: ").append(user.a).append("\n");
		}
		return result.toString();
	}

	// Violations:
	// 1. Side effect in GET method
	// 2. Command Query Separation
	// 3. Misleading method name
	@GetMapping("/side-effect")
	public int getUserCountAndDeleteAll() {
		int count = (int) userRepo.count();
		userRepo.deleteAll();
		return count;
	}

	// Violations:
	// 1. Ambiguous naming
	// 2. Duplicate functionality
	// 3. No validation
	@PostMapping("/add")
	public String addUser(@RequestBody User user) {
		DemoApplication.GLOBAL_USER_CACHE.add(user);
		return "Added successfully!";
	}

	// Violations:
	// 1. Misleading variable names
	// 2. Magic numbers
	// 3. Confusing logic
	@GetMapping("/misleading")
	public String misleadingFunction() {
		int l = 1;
		int O = 0;
		if (O == l) {
			l = 1;
		} else {
			O = 01;
		}
		return "Confusing code executed!";
	}
}

// Violations:
// 1. Unnecessary interface
// 2. Poor naming
//interface IUserRepositoryInterface {
//	List<User> findAll();
//}



// Violations:
// 1. Multiple inheritance
// 2. Excessive method name length
// 3. Poor parameter naming
@Repository
interface UserRepository extends JpaRepository<User, Long>, IUserRepositoryInterface {

}

// Violations:
// 1. Not thread-safe
// 2. Poor encapsulation
// 3. Unnecessary setter
class Util {
	private String prefix;

	public void setPrefix(String prefix) {
		this.prefix = prefix;
	}

	public String formatUserName(String name) {
		return prefix + name;
	}
}