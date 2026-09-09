(function(){
const KEY='dexRecruitUnifiedV1';
const defaultRecord={
 vacancy:{id:'VAC-TEST-001',title:"Dexter's Café All-Rounder / Barista",status:'Open',openDate:'2026-09-09',closeDate:'2026-09-30',positions:1,jobVersion:'JD-v1'},
 candidate:{ref:'DEX-REC-TEST-001',name:'Alex Morgan',preferred:'Alex',email:'alex.morgan@example.test',mobile:'07123 456789',address:'24 Example Street, Glasgow, G51 1AA',role:"Dexter's Café All-Rounder / Barista",hours:'20 hours/week',start:'21 September 2026',pay:'£10.85/hour',dob:'2007-11-18'},
 application:{status:'Application received',submittedAt:null,why:'',experience:'',availability:'',employmentHistory:'Example Café Glasgow — Café Assistant — Mar 2025 to Aug 2026',gaps:'None',training:'Food hygiene awareness; customer service experience',answers:{}},
 screening:{status:'Pending',essentialMet:null,reason:'',rationale:'',managerScore:null},
 interview:{status:'Not scheduled',scheduledAt:'',method:'In person',transcript:'',answers:{},suggestedScores:{},managerScores:{},overrideReasons:{},recordAudio:false,transcriptionOnly:true},
 references:{status:'Pending',items:[{number:1,status:'Not requested',requestedAt:null,receivedAt:null,outcome:'',referee:'Taylor Smith — Example Café Glasgow'},{number:2,status:'Not requested',requestedAt:null,receivedAt:null,outcome:'',referee:''}]},
 rtw:{status:'Pending',method:'',checkDate:'',checker:'',result:'',followUpDate:'',evidenceNote:'',under18:false,apprentice:false},
 offer:{status:'Not sent',sentAt:null,deadline:'2026-09-14',snapshotVersion:null},
 documents:{},
 candidatePortal:{inviteToken:'TEST-ALEX-001',inviteSentAt:null,lastLoginAt:null},
 checks:{complete:false,completedAt:null},
 appointment:{status:'Recruitment',staffCreatedAt:null},
 retention:{unsuccessfulReviewDate:'2027-03-09',successfulRecruitmentReviewDate:'2027-09-09'},
 audit:[],emails:[]
};
function clone(v){return JSON.parse(JSON.stringify(v))}
function mergeDeep(base,extra){
 if(Array.isArray(base)) return Array.isArray(extra)?extra:base;
 if(base&&typeof base==='object'){
  const out={...base};
  if(extra&&typeof extra==='object') Object.keys(extra).forEach(k=>out[k]=k in base?mergeDeep(base[k],extra[k]):extra[k]);
  return out;
 }
 return extra===undefined?base:extra;
}
function load(){
 try{return mergeDeep(clone(defaultRecord),JSON.parse(localStorage.getItem(KEY)||'{}'))}
 catch(e){return clone(defaultRecord)}
}
function save(r){localStorage.setItem(KEY,JSON.stringify(r));return r}
function audit(action,detail,actor='TEST Manager'){
 const r=load();r.audit.unshift({at:new Date().toISOString(),actor,action,detail});save(r);return r
}
function queueEmail(type,to,subject,body){
 const r=load();r.emails.unshift({id:'MAIL-'+Date.now(),type,to,subject,body,status:'TEST queued',createdAt:new Date().toISOString()});save(r);audit('Email queued',type+' → '+to);return r
}
function snapshot(key,title,html,signature){
 const r=load();
 const version=(r.documents[key]?.version||0)+1;
 r.documents[key]={key,title,html,version,signed:false,signature:null,signedAt:null,createdAt:new Date().toISOString()};
 if(signature){r.documents[key].signature=signature}
 save(r);audit('Document snapshot created',title+' v'+version);return r.documents[key]
}
function sign(key,signature){
 const r=load();if(!r.documents[key])throw new Error('Document not available');
 r.documents[key].signed=true;r.documents[key].signature=signature;r.documents[key].signedAt=new Date().toISOString();save(r);audit('Document signed',r.documents[key].title+' by '+signature,'Candidate');return r.documents[key]
}
function allSigned(keys){const r=load();return keys.every(k=>r.documents[k]?.signed)}
function reset(){save(clone(defaultRecord));audit('Test record reset','Unified recruitment test reset');return load()}
window.DexRecruit={KEY,defaultRecord,load,save,audit,queueEmail,snapshot,sign,allSigned,reset};
})();