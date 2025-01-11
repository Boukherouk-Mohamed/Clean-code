package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.io.FileWriter;
import java.io.Serializable;

// Violations:
// 1. Entity mixes persistence and business logic
// 2. Implements Serializable without versioning
// 3. Poor encapsulation with public fields
@Entity @Getter @Setter
public class User implements Serializable {
    @Id
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
