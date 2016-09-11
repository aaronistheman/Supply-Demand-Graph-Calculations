"use strict";

var States = {
  Equilibrium : "Equilibrium",
  Shortage : "Shortage",
  Surplus : "Surplus",
};

var Graph = {
  Supply : "Supply",
  Demand : "Demand",
  None : "None",
};

var Mechanism = {
  Floor : "Floor",
  Ceiling : "Ceiling",
  None : "None",
};

// For conversion from HTML option values to the above constants
function toMechanism(str) {
  switch (str) {
    case "floor": case "Floor":
      return Mechanism.Floor;
    case "ceiling": case "Ceiling":
      return Mechanism.Ceiling;
    default:
      alertAndThrowException("Unmatched argument for toMechanism()");
  }
}