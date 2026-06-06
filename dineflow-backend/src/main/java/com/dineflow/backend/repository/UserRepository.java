package com.dineflow.backend.repository;

import com.dineflow.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Long countByRoleRoleName(String roleName);

    List<User> findByRoleRoleNameIn(List<String> roleNames);

    List<User> findByRoleRoleNameInOrderByCreatedAtDesc(List<String> roleNames);

    @Query(value = """
        SELECT DATE(u.created_at) AS label, COUNT(*) AS value
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE r.role_name = 'CUSTOMER'
        AND u.created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        GROUP BY DATE(u.created_at)
        ORDER BY DATE(u.created_at)
        """, nativeQuery = true)
    List<Object[]> getDailyCustomersLast7Days();

    @Query(value = """
        SELECT DATE_FORMAT(u.created_at, '%Y-%m') AS label, COUNT(*) AS value
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE r.role_name = 'CUSTOMER'
        AND u.created_at >= DATE_SUB(CURDATE(), INTERVAL 11 MONTH)
        GROUP BY DATE_FORMAT(u.created_at, '%Y-%m')
        ORDER BY MIN(u.created_at)
        """, nativeQuery = true)
    List<Object[]> getMonthlyCustomersLast12Months();

    @Query(value = """
        SELECT YEAR(u.created_at) AS label, COUNT(*) AS value
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE r.role_name = 'CUSTOMER'
        GROUP BY YEAR(u.created_at)
        ORDER BY YEAR(u.created_at)
        """, nativeQuery = true)
    List<Object[]> getYearlyCustomers();
}