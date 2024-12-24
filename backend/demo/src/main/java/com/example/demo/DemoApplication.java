package com.example.demo;


// Violation: Unnecessary imports and poor organization
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.io.*;
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
// 1. Entity mixes persistence and business logic
// 2. Implements Serializable without versioning
// 3. Poor encapsulation with public fields
@Entity
class User implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long id;

	// Violations:
	// 1. Cryptic variable names
	// 2. Public fields violate encapsulation
	public String n;
	public Integer a;
	public Boolean isA;

	// Violations:
	// 1. Mixed responsibilities (file I/O in entity)
	// 2. Empty catch block
	// 3. Resource leak potential
	public void saveToFile() {
		try {
			FileWriter fw = new FileWriter("users.txt", true);
			fw.write(this.n + "," + this.a + "\n");
			fw.close();
		} catch(Exception e) {
		}
	}

	// Violation: God method with multiple responsibilities
	public void processUser() {
		validateUser();
		//updateDatabase();
		//sendEmail();
		//updateCache();
		//generateReport();
	}

	// Violations:
	// 1. Deep nesting
	// 2. Empty if block
	// 3. Poor validation logic
	private void validateUser() {
		if(this.n != null && !this.n.isEmpty()) {
			if(this.a != null && this.a > 0) {
				if(this.isA != null) {
				}
			}
		}
	}
}

// Violations:
// 1. No service layer
// 2. Controller has direct repository access
// 3. Mixed responsibilities
@RestController
@RequestMapping("/api/v1/users")
class UserController {
	// Violation: Field injection instead of constructor injection
	@Autowired
	private UserRepository userRepo;

	// Violations:
	// 1. Hardcoded credentials
	// 2. Returns null
	// 3. Database connection in controller
	private Connection getConnection() {
		try {
			return DriverManager.getConnection("jdbc:mysql://localhost:3306/db", "root", "password");
		} catch(Exception e) {
			return null;
		}
	}

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
		return "User updated!";
	}

	// Violations:
	// 1. No error handling
	// 2. No validation
	// 3. Hardcoded response
	@DeleteMapping("/{id}")
	public String deleteUser(@PathVariable Long id) {
		userRepo.deleteById(id);
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
		userRepo.save(user);
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
interface IUserRepositoryInterface {
	List<User> findAll();
}

// Violations:
// 1. Multiple inheritance
// 2. Excessive method name length
// 3. Poor parameter naming
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