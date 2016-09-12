"use strict";

/**
 * Deals with the event handlers that allow the user to change
 * the economic model.
 */
function SettingsController() {
  if (!(this instanceof SettingsController))
    alertAndThrowException(
      "Forgot 'new' before SettingsController constructor");
} // SettingsController()

SettingsController.prototype = {
  constructor : SettingsController,
  
  /**
   * @param economyModel instance of EconomyModel
   * @param textView instance of TextView
   * @param graphView instance of GraphView
   */
  setUpAllHandlers : function(economyModel, textView, graphView) {
    $("#b-world-p").click(function() {
      SettingsController.newWorldPriceHandler(
        economyModel, textView, graphView);
    });
    
    $("#closed-open-checkbox").change(function() {
      SettingsController.closingOrOpeningEconomyHandler(
        economyModel, textView, graphView, this);
    });
    
    $("#public-private-checkbox").change(function() {
      var economyIsOpen = !($("#closed-open-checkbox")[0].checked);
      
      SettingsController.publicizingOrPrivatizingEconomyHandler(
        economyModel, textView, graphView, this, economyIsOpen);
    });
    
    $("#b-tax-amount").click(function() {
      SettingsController.taxAmountChangeHandler(
        economyModel, textView, graphView);
    });
    $("#b-subsidy-amount").click(function() {
      SettingsController.subsidyAmountChangeHandler(
        economyModel, textView, graphView);
    });
    $("#what-taxed").change(function() {
      SettingsController.whatTaxedChangeHandler(
        economyModel, textView, graphView);
    });
    $("#what-subsidized").change(function() {
      SettingsController.whatSubsidizedChangeHandler(
        economyModel, textView, graphView);
    });
    
    $("#price-mech-type").change(function() {
      SettingsController.priceMechanismTypeChanged(
        economyModel, textView, graphView);
    });
    $("#b-price-mech-amount").click(function() {
      SettingsController.priceMechanismAmountChanged(
        economyModel, textView, graphView);
    });
    
    $("#b-tariff-amount").click(function() {
      SettingsController.tariffAmountChanged(
        economyModel, textView, graphView);
    });
  },
}; // SettingsController.prototype

/**
 * @param economyModel instance of EconomyModel
 * @param textView instance of TextView
 * @param graphView instance of GraphView
 */
SettingsController.newWorldPriceHandler =
  function(economyModel, textView, graphView) {
  var newWp = parseFloat($("#new-wp").val());
  
  if (!newWp || newWp < economyModel.ep) { // if valid input that I can handle
    try {
      economyModel.setWp(newWp);
      
      textView.updateAll(economyModel);
      graphView.updateAll(economyModel);
    }
    catch(err) {
      if (err == "demand extrapolation")
        alert("User Error: World price causes extrapolation " +
          "on demand data, so no changes made.")
      else if (err == "supply extrapolation")
        alert("User Error: World price causes extrapolation " +
          "on supply data, so no changes made.")
      else
        throw err;
    }
  }
  else { // if valid input that I can't handle
    alert("User Error: Because the developer wasn't particularly " +
          "knowledgeable about economics, a set world " +
          "price must be below the equilibrium price. His apologies.");
  }
}; // newWorldPriceHandler()

/**
 * @param economyModel instance of EconomyModel
 * @param textView instance of TextView
 * @param graphView instance of GraphView
 * @param checkbox the HTML checkbox element that was acted on
 */
SettingsController.closingOrOpeningEconomyHandler =
  function(economyModel, textView, graphView, checkbox) {
  if (checkbox.checked) { // if checked the box to close economy
    cancelOpenPublicEconomy(economyModel);
    economyModel.setWp(undefined);
    textView.updateAll(economyModel);
    graphView.updateAll(economyModel);
  }
  else { // if user desires to open economy
    cancelClosedPublicEconomy(economyModel, textView);
    
    textView.updateAll(economyModel);
    graphView.updateAll(economyModel);
  }
}; // closingOrOpeningEconomyHandler()

/**
 * @param economyModel instance of EconomyModel
 * @param textView instance of TextView
 * @param graphView instance of GraphView
 * @param checkbox the HTML checkbox element that was acted on
 */
SettingsController.publicizingOrPrivatizingEconomyHandler =
  function(economyModel, textView, graphView, checkbox, economyIsOpen) {
  if (checkbox.checked) { // if checked the box to publicize economy
    // nothing for now
  }
  else { // if user desires to privatize economy
    if (economyIsOpen)
      cancelOpenPublicEconomy(economyModel);
    else
      cancelClosedPublicEconomy(economyModel, textView);
    
    textView.updateAll(economyModel);
    graphView.updateAll(economyModel);
  }
}; // closingOrOpeningEconomyHandler()

function cancelOpenPublicEconomy(economyModel) {
  economyModel.cancelTariff();
} // cancelOpenPublicEconomy()

function cancelClosedPublicEconomy(economyModel, textView) {
  // Cancel price mechanism
  economyModel.switchPriceMechanism(Mechanism.None);
  
  // Cancel tax (but maintain the graph in case graph gets switched)
  var whatTaxed;
  if (textView.getWhatTaxed() == "demand")
    whatTaxed = Graph.Demand;
  else
    whatTaxed = Graph.Supply;
  economyModel.setTax(whatTaxed, 0);
  
  // Cancel subsidy (but maintain the graph in case graph gets switched)
  var whatSubsidized;
  if (textView.getWhatSubsidized() == "demand")
    whatSubsidized = Graph.Demand;
  else
    whatSubsidized = Graph.Supply;
  economyModel.setSubsidy(whatSubsidized, 0);
} // cancelClosedPublicEconomy()

/**
 * @param economyModel instance of EconomyModel
 * @param textView instance of TextView
 * @param graphView instance of GraphView
 */
SettingsController.taxAmountChangeHandler =
  function(economyModel, textView, graphView) {
  // Determine what's being taxed
  var whatTaxed;
  if (textView.getWhatTaxed() == "demand")
    whatTaxed = Graph.Demand;
  else
    whatTaxed = Graph.Supply;
    
  economyModel.setTax(whatTaxed, textView.getTaxAmount());
  
  textView.updateAll(economyModel);
  graphView.updateAll(economyModel);
};

/**
 * @param economyModel instance of EconomyModel
 * @param textView instance of TextView
 * @param graphView instance of GraphView
 */
SettingsController.subsidyAmountChangeHandler =
  function(economyModel, textView, graphView) {
  // Determine what's being subsidized
  var whatSubsidized;
  if (textView.getWhatSubsidized() == "demand")
    whatSubsidized = Graph.Demand;
  else
    whatSubsidized = Graph.Supply;
    
  economyModel.setSubsidy(whatSubsidized, textView.getSubsidyAmount());
  
  textView.updateAll(economyModel);
  graphView.updateAll(economyModel);
};

/**
 * @param economyModel instance of EconomyModel
 * @param textView instance of TextView
 * @param graphView instance of GraphView
 */
SettingsController.whatTaxedChangeHandler =
  function(economyModel, textView, graphView) {
  economyModel.switchTaxedGraph();
  
  textView.updateAll(economyModel);
  graphView.updateAll(economyModel);
};

/**
 * @param economyModel instance of EconomyModel
 * @param textView instance of TextView
 * @param graphView instance of GraphView
 */
SettingsController.whatSubsidizedChangeHandler =
  function(economyModel, textView, graphView) {
  economyModel.switchSubsidizedGraph();
  
  textView.updateAll(economyModel);
  graphView.updateAll(economyModel);
};

/**
 * @param economyModel instance of EconomyModel
 * @param textView instance of TextView
 * @param graphView instance of GraphView
 */
SettingsController.priceMechanismTypeChanged =
  function(economyModel, textView, graphView) {
  var whichPm = $("#price-mech-type").val();
  economyModel.switchPriceMechanism(toMechanism(whichPm));
  
  textView.updateAll(economyModel);
  graphView.updateAll(economyModel);
};

/**
 * @param economyModel instance of EconomyModel
 * @param textView instance of TextView
 * @param graphView instance of GraphView
 */
SettingsController.priceMechanismAmountChanged =
  function(economyModel, textView, graphView) {
  var whichPm = $("#price-mech-type").val();
  var newPm = parseFloat($("#new-pm-amount").val());
  economyModel.setPriceMechanismAmount(toMechanism(whichPm), newPm);
  
  textView.updateAll(economyModel);
  graphView.updateAll(economyModel);
};

SettingsController.tariffAmountChanged =
  function(economyModel, textView, graphView) {
  economyModel.setTariffAmount(parseFloat($("#new-tariff-amount").val()));
  
  textView.updateAll(economyModel);
  graphView.updateAll(economyModel);
};