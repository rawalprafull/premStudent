'use strict';

const shim = require('fabric-shim');
const util = require('util');

let Chaincode = class {
// ===============================================================================================================
// The Init method is called when the Smart Contract 'digitalOnboarding' is instantiated by the blockchain network
// ===============================================================================================================
async Init(stub) {
 let ret = stub.getFunctionAndParameters();
 console.info(ret);
 console.info('=========== Instantiated digitalOnboarding chaincode ===========');
 return shim.success();
}

// ===============================================================================================================
// The Invoke method is called as a result of an application request to run the Smart Contract 'digitalOnbaording'
// ===============================================================================================================
async Invoke(stub) {
 let ret = stub.getFunctionAndParameters();
 console.info(ret);
 let method = this[ret.fcn];
 if (!method) {
  console.log('no function of name:' + ret.fcn + ' found');
  throw new Error('Received unknown function ' + ret.fcn + ' invocation');
 }
 try {
  let payload = await method(stub, ret.params);
  return shim.success(payload);
 } catch (err) {
  console.log(err);
 return shim.error(err);
 }
}

// =======================================
//  Add Student Details Record Into Ledger
// =======================================
async addStudentRecord(stub, args) {
 console.info('============= START : Add Student Records ===========');
 if (args.length != 1) {
  throw new Error('Incorrect number of arguments. Expecting 1');
 }
 let txnId = stub.getTxID();
 let studentDetails = JSON.parse(args[0]);
 studentDetails.txnMsg = 'Applicant data successfully inserted into blockchain.';

 // ==== Check if student with digitalId already exists ====
 let digitalIdExist = await stub.getState(studentDetails.digitalId);
 if (digitalIdExist.toString()) {
  throw new Error('This student already exists: ' + digitalIdExist);
 }
 await stub.putState(studentDetails.digitalId, Buffer.from(JSON.stringify(studentDetails)));
 console.info('============= END : Add Student Record ===========');
 return Buffer.from(txnId);
}

// ==============================================================
//  Add Internal Assessment Details To Student Record Into Ledger
// ==============================================================
async addInternalAssessmentDetails(stub, args) {
 console.info('============= START : Add Internal Assessment Details ===========');
 if (args.length != 1) {
throw new Error('Incorrect number of arguments. Expecting 1');
 }
 let txnId = stub.getTxID();
 let studentInfo = JSON.parse(args[0]);
 let studentAsBytes = await stub.getState(studentInfo.digitalId);
 let studentDetails = JSON.parse(studentAsBytes);
 if (studentDetails.internalAssessmentDetails.length === 0) {
  studentDetails.internalAssessmentDetails.push(studentInfo.internalAssessmentDetails[0]);
  studentDetails.txnMsg = 'Internal Assessment details added to the applicant record.';
 } else {
  for (var i = 0; i < studentInfo.internalAssessmentDetails.length; i++) {
   var exist = false;
   for (var j = 0; j < studentDetails.internalAssessmentDetails.length; j++) {
    if (studentDetails.internalAssessmentDetails[j].internalAssessmentRegistrationId === studentInfo.internalAssessmentDetails[i].internalAssessmentRegistrationId)
     exist = true;
   }
   if (!exist)
    studentDetails.internalAssessmentDetails.push(studentInfo.internalAssessmentDetails[i]);
    studentDetails.txnMsg = 'Internal Assessment details added to the applicant record.';
  }
 }
 await stub.putState(studentInfo.digitalId, Buffer.from(JSON.stringify(studentDetails)));
 console.info('============= END : Add Internal Assessment Details ===========');
 return Buffer.from(txnId);
}

// =====================================================
//  Add University Details To Student Record Into Ledger
// =====================================================
async addUniveristyDetails(stub, args) {
 console.info('============= START : Add New Univeristy To Student Record ===========');
throw new Error('Incorrect number of arguments. Expecting 1');
 }
 let txnId = stub.getTxID();
 let studentInfo = JSON.parse(args[0]);
 let studentAsBytes = await stub.getState(studentInfo.digitalId);
 let studentDetails = JSON.parse(studentAsBytes);
 if (studentDetails.universityDetails.length === 0) {
  studentDetails.universityDetails.push(studentInfo.universityDetails[0]);
  studentDetails.txnMsg = 'University details added to the applicant record.';
 }
 await stub.putState(studentInfo.digitalId, Buffer.from(JSON.stringify(studentDetails)));
 console.info('============= END : Add New Univeristy To Student Record  ===========');
 return Buffer.from(txnId);
}

// ==============================================================
//  Add Final Diploma Score Details To Student Record Into Ledger
// ==============================================================
async addFinalDiplomaScoreDetails(stub, args) {
 console.info('============= START : Add Final Diploma Score Details To Student Record ===========');
 if (args.length != 1) {
  throw new Error('Incorrect number of arguments. Expecting 1');
 }
 let txnId = stub.getTxID();
 let studentInfo = JSON.parse(args[0]);
 let studentAsBytes = await stub.getState(studentInfo.digitalId);
 let studentDetails = JSON.parse(studentAsBytes);
 studentDetails.diplomaDetails.diplomaDetails.diplomaTotalScore = studentInfo.diplomaDetails.diplomaTotalScore;
 studentDetails.diplomaDetails.diplomaSubjectsAndScores.group1Score = studentInfo.diplomaDetails.diplomaSubjectsAndScores.group1Score;
 studentDetails.diplomaDetails.diplomaSubjectsAndScores.group2Score = studentInfo.diplomaDetails.diplomaSubjectsAndScores.group2Score;
 studentDetails.diplomaDetails.diplomaSubjectsAndScores.group3Score = studentInfo.diplomaDetails.diplomaSubjectsAndScores.group3Score;
 studentDetails.diplomaDetails.diplomaSubjectsAndScores.group4Score = studentInfo.diplomaDetails.diplomaSubjectsAndScores.group4Score;
 studentDetails.diplomaDetails.diplomaSubjectsAndScores.group5Score = studentInfo.diplomaDetails.diplomaSubjectsAndScores.group5Score;
 studentDetails.diplomaDetails.diplomaSubjectsAndScores.group6Score = studentInfo.diplomaDetails.diplomaSubjectsAndScores.group6Score;
 studentDetails.txnMsg = 'Final diploma score details added to the applicant record.';

 await stub.putState(studentInfo.digitalId, Buffer.from(JSON.stringify(studentDetails)));
 console.info('============= END : Add Final Diploma Score Details To Student Record  ===========');
 return Buffer.from(txnId);
}

// =====================================================================
//  Add Final Diploma Exam Registration Id To Student Record Into Ledger
// =====================================================================
async addFinalDiplomaExamRegistrationId(stub, args) {
 console.info('============= START : Add Final Diploma Exam Registration Id To Student Record ===========');
 if (args.length != 1) {
  throw new Error('Incorrect number of arguments. Expecting 1');
 }
 let txnId = stub.getTxID();
 let studentInfo = JSON.parse(args[0]);
 let studentAsBytes = await stub.getState(studentInfo.digitalId);
 let studentDetails = JSON.parse(studentAsBytes);
 studentDetails.diplomaDetails.diplomaRegistartionId = studentInfo.diplomaDetails.diplomaRegistartionId;
 studentDetails.txnMsg = 'Final diploma exam registartion id added to the applicant record.';

 await stub.putState(studentInfo.digitalId, Buffer.from(JSON.stringify(studentDetails)));
 console.info('============= END : Add Final Diploma Exam Registration Id To Student Record  ===========');
 return Buffer.from(txnId);
}

// ===================================================================
//  Add Final Diploma Transcript Details To Student Record Into Ledger
// ===================================================================
async addFinalDiplomaTranscriptDetails(stub, args) {
 console.info('============= START : Add Final Diploma Transcript Details To Student Record ===========');
 if (args.length != 1) {
  throw new Error('Incorrect number of arguments. Expecting 1');
 }
 let txnId = stub.getTxID();
 let studentInfo = JSON.parse(args[0]);
 let studentAsBytes = await stub.getState(studentInfo.digitalId);
 let studentDetails = JSON.parse(studentAsBytes);
 studentDetails.diplomaDetails.diplomaCertificate = studentInfo.finalDiplomaInfo.diplomaCertificate;
 studentDetails.diplomaDetails.diplomaEndDate = studentInfo.finalDiplomaInfo.diplomaEndDate;
 studentDetails.txnMsg = 'Final diploma transcript details added to the applicant record.';

 await stub.putState(studentInfo.digitalId, Buffer.from(JSON.stringify(studentDetails)));
 console.info('============= END : Add Final Diploma Transcript Details To Student Record  ===========');
 return Buffer.from(txnId);
}

// ================================================
//  Query Ledger For Student Details with digitalId
// ================================================
async queryStudentDetails(stub, args) {
 if (args.length != 1) {
  throw new Error('Incorrect number of arguments. Expecting digitalId ex: 123456');
 }
 let digitalId = args[0];
 let studentAsBytes = await stub.getState(digitalId);
 if (!studentAsBytes || studentAsBytes.toString().length <= 0) {
  throw new Error(digitalId + ' does not exist: ');
 }
 return studentAsBytes;
}


// =========================================
//  Query Ledger For All Txns with digitalId
// =========================================
async queryAllDetailsForADigitalId(stub, args) {
 if (args.length != 1) {
  throw new Error('Incorrect number of arguments. Expecting digitalId ex: 123456');
 }
 let digitalId = args[0];
 const iterator = await stub.getHistoryForKey(digitalId);
 const allResults = [];
 while (true) {
  const res = await iterator.next();
  if (res.value && res.value.value.toString()) {
   console.log(res.value.toString('utf8'));
   const tx_id = res.value.tx_id;
   let Record;
   try {
    Record = JSON.parse(res.value.value.toString('utf8'));
   } catch (err) {
    console.log(err);
    Record = res.value.value.toString('utf8');
   }
   allResults.push({
    tx_id,
    Record
   });
  }
  if (res.done) {
   console.log('end of data');
   await iterator.close();
   return Buffer.from(JSON.stringify(allResults));
  }
 }
}

// =====================================
//  Query Ledger For All Student Records
// =====================================
async queryAllDigitalIdRecords(stub) {
 const startKey = '0';
 const endKey = '9999999999999999999';
 const iterator = await stub.getStateByRange(startKey, endKey);
 const allResults = [];
 while (true) {
  const res = await iterator.next();
  if (res.value && res.value.value.toString()) {
   console.log(res.value.value.toString('utf8'));
   const Key = res.value.key;
   let Record;
   try {
    Record = JSON.parse(res.value.value.toString('utf8'));
   } catch (err) {
    console.log(err);
    Record = res.value.value.toString('utf8');
   }
   allResults.push({
    Key,
    Record
   });
  }
  if (res.done) {
   console.log('end of data');
   await iterator.close();
   return Buffer.from(JSON.stringify(allResults));
  }
 }
}

// ================================================
//  Init Ledger To Instantiate Chaincode On Network
// ================================================
async initLedger(stub) {
 console.info('============= START : Initialize Ledger ===========');
 let idProofInfo = {};
 let ppInfo = {};
 let universityInfo = [];
 let assessmentInfo = [];
 let studentDetails = {};
 let diplomaInfo = {};
 let subjectAndScore = {};
 let finalDiplomaInfo = {};

 subjectAndScore.group1Subject = 'Mathematics';
 subjectAndScore.group1Score = '7';

 ppInfo._id = '1556547725595';
 ppInfo.docName = 'pp';
 ppInfo.docType = 'image/png';
 ppInfo.digitalId = '1556547725595';

 idProofInfo._id = '1556547725595';
 idProofInfo.docName = 'idProof';
 idProofInfo.docType = 'image/png';
 idProofInfo.digitalId = '1556547725595';

 finalDiplomaInfo.diplomaRegistartionId = '1556547725595';
 finalDiplomaInfo.diplomaTotalScore = '34';
 finalDiplomaInfo.diplomaCertificate = '';
 finalDiplomaInfo.diplomaStartDate = '1992-06-08T18:30:00.000Z';
 finalDiplomaInfo.diplomaEndDate = '1992-06-08T18:30:00.000Z';
 finalDiplomaInfo.diplomaSubjectsAndScores = subjectAndScore;


 universityInfo.push({
  courseAppliedFor: 'Microservices',
  appliedDegreeType: 'UG'
 });

 assessmentInfo.push({
  internalAssessmentRegistrationId: '1556547725595',
  assessmentUserAnswer: 'd,c,c,b,a',
  assessmentCorrectAnswer: 'a,d,c,c,a',
  assessmentScore: '',
  digitalId: '1556547245127',
  assessmentCode: '5cc44761701c6',
  assessmentName: 'Computer Science'
 });

 studentDetails.digitalId = '1550134215751';
 studentDetails.fullName = 'Prem Dutt';
 studentDetails.emailId = 'prem09jun@gmail.com';
 studentDetails.countrycode = '91';
 studentDetails.nationalId = '965874123';
 studentDetails.mobileNumber = '9971480085';
 studentDetails.gender = 'Male';
 studentDetails.address = 'Delhi';
 studentDetails.createTimestamp = '1550134215751';
 studentDetails.dateOfBirth = '1992-06-08T18:30:00.000Z';
 studentDetails.idProof = idProofInfo;
 studentDetails.applicantImg = ppInfo;
 studentDetails.universityDetails = universityInfo;
 studentDetails.internalAssessmentDetails = assessmentInfo;
 studentDetails.diplomaDetails = finalDiplomaInfo;
 studentDetails.txnMsg = 'Init Function Of Blockchain';

 await stub.putState(studentDetails.digitalId, Buffer.from(JSON.stringify(studentDetails)));
 console.info('============= END : Initialize Ledger ===========');
}
};
shim.start(new Chaincode());                                                                                                    
 
