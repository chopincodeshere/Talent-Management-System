package com.tecunique.tms.exceptions;

import org.springframework.validation.BindingResult;

public class InvalidRequestException extends RuntimeException {
  private final BindingResult bindingResult;

  public InvalidRequestException(String message, BindingResult bindingResult) {
    super(message);
    this.bindingResult = bindingResult;
  }

  public BindingResult getBindingResult() {
    return bindingResult;
  }
}
