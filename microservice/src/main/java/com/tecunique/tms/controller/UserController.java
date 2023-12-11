package com.tecunique.tms.controller;

import com.tecunique.tms.common.Constants;
import com.tecunique.tms.dto.UserDto;
import com.tecunique.tms.entity.User;
import com.tecunique.tms.repository.UserRepository;
import java.security.Principal;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {
  @Autowired private UserRepository repository;

  private BCryptPasswordEncoder passwordEncoder;

  @PostMapping("/")
  public String joinGroup(@RequestBody User user) {
    System.out.println("HI");
    user.setUsername(user.getUsername());
    user.setRole(Constants.DEFAULT_ROLE); // INTERVIEWER
    String encryptedPwd = passwordEncoder.encode(user.getPassword());
    user.setPassword(encryptedPwd);

    repository.save(user);
    return "Hi " + user.getUsername() + " welcome to group !";
  }

  @GetMapping("/")
  @PreAuthorize("hasAuthority('ROLE_ADMIN')")
  public ResponseEntity<List<UserDto>> loadUsers() {
    List<User> users = repository.findAll();
    List<UserDto> userDtos = users.stream().map(this::convertToDto).collect(Collectors.toList());

    return new ResponseEntity<>(userDtos, HttpStatus.OK);
  }

  @GetMapping("/access/{userId}/{userRole}")
  // @Secured("ROLE_ADMIN")
  @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_MODERATOR')")
  public String giveAccessToUser(
      @PathVariable int userId, @PathVariable String userRole, Principal principal) {
    User user = repository.findById((long) userId).get();
    List<String> activeRoles = getRolesByLoggedInUser(principal);
    String newRole = "";
    if (activeRoles.contains(userRole)) {
      newRole = user.getRole() + "," + userRole;
      user.setRole(newRole);
    }
    repository.save(user);
    return "Hi " + user.getUsername() + " New Role assign to you by " + principal.getName();
  }

  private List<String> getRolesByLoggedInUser(Principal principal) {
    String roles = getLoggedInUser(principal).getRole();
    List<String> assignRoles = Arrays.stream(roles.split(",")).collect(Collectors.toList());
    if (assignRoles.contains("ROLE_ADMIN")) {
      return Arrays.stream(Constants.ADMIN_ACCESS).collect(Collectors.toList());
    }
    if (assignRoles.contains("ROLE_MODERATOR")) {
      return Arrays.stream(Constants.MODERATOR_ACCESS).collect(Collectors.toList());
    }
    return Collections.emptyList();
  }

  private User getLoggedInUser(Principal principal) {
    return repository.findByUsername(principal.getName());
  }

  private UserDto convertToDto(User user) {
    UserDto dto = new UserDto();
    dto.setId(user.getId());
    dto.setUsername(user.getUsername());
    dto.setRoles(user.getRole());
    return dto;
  }
}
