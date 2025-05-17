const mongoose = require("mongoose");

const ScoringSchema = new mongoose.Schema({
  scoring: {
    type: Number,
  },
  //Хэрэглэгчийн мэдээлэл
  customerInfoScore: {
    type: Number,
  },
  //чанаргүй зээл
  paymentHistory: {
    type: Number,
  },
  //нийт зээлийн үлдэгдэл
  availableLoanAmount: {
    type: Number,
  },
  //Зээлийн түүхийн урт
  loanHistoryLength: {
    type: Number,
  },
  //өр орлогын харьцаа DTI
  DTI: {
    type: Number,
  },
});

module.exports = mongoose.model("Scoring", ScoringSchema);
