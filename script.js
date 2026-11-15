var MODS=['Student Academic Assistant','Kids & Parent Assistant','Personal / Business Assistant'];
var MODBN={'Student Academic Assistant':'শিক্ষার্থী একাডেমিক সহায়ক','Kids & Parent Assistant':'শিশু ও অভিভাবক সহায়ক','Personal / Business Assistant':'ব্যক্তিগত / ব্যবসায়িক সহায়ক'};
var PRI=['Critical','High','Medium','Low'],STA=['Idea','Planned','In Progress','Ready','Deferred'],PHA=['MVP','Phase 2','Future'];
var KEY='feature-planner-v1',SEEDV='seed-1';
var OAUTH='Must be built with the official Google API and OAuth consent flow. No access to Google data without user consent; never show a fake connected state. Not connected in this planning tool.';
function S(id,n,bn,d,m,pr,st,ph,au,no,t){return{id:id,name:n,nameBn:bn,desc:d,module:m,priority:pr,status:st,phase:ph,audience:au,notes:no||'',created:t,updated:t}}
var A=MODS[0],K=MODS[1],P=MODS[2];
var SEED=[
S('seed-class-reminders','Class Reminders','ক্লাস রিমাইন্ডার','Reminder before the student\u2019s class.',A,'High','Planned','MVP','Students'),
S('seed-exam-manager','Exam Manager','পরীক্ষা ম্যানেজার','Exams, dates and preparation planning.',A,'High','Planned','MVP','Students'),
S('seed-assessment-manager','Assessment Manager','অ্যাসেসমেন্ট ম্যানেজার','Tracking of assignments, quizzes, projects and submissions.',A,'Medium','Planned','Phase 2','Students'),
S('seed-attendance-tracker','Attendance Tracker','উপস্থিতি ট্র্যাকার','Record of attendance and absence.',A,'Medium','Idea','Phase 2','Students'),
S('seed-notice-assistant','Notice Assistant','নোটিশ সহায়ক','Find academic notices and summarise the important information.',A,'Medium','Idea','Phase 2','Students'),
S('seed-academic-calendar','Academic Calendar','একাডেমিক ক্যালেন্ডার','Calendar of classes, exams, holidays and academic events.',A,'High','Planned','MVP','Students'),
S('seed-campus-timetable','Campus Timetable Management','ক্যাম্পাস টাইমটেবিল ম্যানেজমেন্ট','Manage the timetable from the campus server. Admin or Editor roles create and edit routines; affected students are notified when a routine changes.',A,'Critical','Planned','MVP','Admin, Editor, Students','Role-based access required (Admin, Editor). Not enforced in this planning tool.'),
S('seed-teacher-notice-board','Teacher-managed Academic Notice Board','শিক্ষক-পরিচালিত নোটিশ বোর্ড','Teachers or approved staff publish and manage notices; students can view them.',A,'High','Planned','MVP','Teachers, Staff, Students','Role-based access required (Teacher). Not enforced in this planning tool.'),
S('seed-math-tutor','Bangladesh-focused AI Math Tutor','বাংলাদেশ-কেন্দ্রিক AI গণিত টিউটর','Student sends a photo of a maths question. The AI gives a step-by-step solution in Bangla and then verifies the answer, aiming at the Bangladesh curriculum.',A,'Critical','In Progress','MVP','Students','If the image text is unclear, the AI must ask the student to confirm the question. An answer must not be shown as certain without verification.'),
S('seed-google-classroom','Google Classroom','গুগল ক্লাসরুম','Planned integration with Google Classroom.',A,'High','Planned','Phase 2','Students, Teachers',OAUTH),
S('seed-google-calendar','Google Calendar','গুগল ক্যালেন্ডার','Planned integration with Google Calendar.',A,'High','Planned','Phase 2','Students',OAUTH),
S('seed-google-drive','Google Drive','গুগল ড্রাইভ','Planned integration with Google Drive.',A,'Medium','Planned','Phase 2','Students',OAUTH),
S('seed-gmail','Gmail','জিমেইল','Planned integration with Gmail.',A,'Medium','Planned','Phase 2','Students',OAUTH),
S('seed-parent-reminders','Parent Reminders','অভিভাবক রিমাইন্ডার','Reminders for parents about school, activities, appointments or needed tasks for children.',K,'High','Planned','MVP','Parents','Collect only the minimum data about children.'),
S('seed-preparation-assistance','Preparation Assistance','প্রস্তুতি সহায়তা','Reminds child and parent what to prepare before a school day, exam or scheduled activity.',K,'Medium','Planned','Phase 2','Parents, Children','Collect only the minimum data about children.'),
S('seed-personal-placeholder','Personal assistant (placeholder)','ব্যক্তিগত সহায়ক (প্লেসহোল্ডার)','Placeholder only. Scope not defined yet.',P,'Low','Idea','Future','To be decided'),
S('seed-business-placeholder','Business assistant (placeholder)','ব্যবসায়িক সহায়ক (প্লেসহোল্ডার)','Placeholder only. Scope not defined yet.',P,'Low','Idea','Future','To be decided')
];
var T0=Date.now();SEED.forEach(function(f,i){var t=new Date(T0-(i*3600e3*7)).toISOString();f.created=t;f.updated=t});
var DB={features:[],seeded:''},view='dash',editing=null,delId=null,Q={q:'',module:'',priority:'',status:'',phase:'',sort:'updated'};
function load(){try{var r=localStorage.getItem(KEY);if(r)DB=JSON.parse(r)}catch(e){}
 if(DB.seeded!==SEEDV){var have={};DB.features.forEach(function(f){have[f.id]=1});SEED.forEach(function(s){if(!have[s.id])DB.features.push(s)});DB.seeded=SEEDV;save()}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(DB))}catch(e){}}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function cls(s){return s.replace(/\s/g,'')}
function ago(iso){var d=Math.round((Date.now()-new Date(iso))/6e4);if(d<1)return'Just now';if(d<60)return d+' min ago';if(d<1440)return Math.round(d/60)+' h ago';return Math.round(d/1440)+' d ago'}
function badges(f){return '<span class="badge b-'+f.priority+'">'+f.priority+'</span><span class="badge s-'+cls(f.status)+'">'+f.status+'</span><span class="badge p-'+cls(f.phase)+'">'+f.phase+'</span>'}
function count(k,v){return DB.features.filter(function(f){return f[k]===v}).length}
function opts(a,sel,all){return (all?'<option value="">'+all+'</option>':'')+a.map(function(x){return'<option'+(x===sel?' selected':'')+'>'+esc(x)+'</option>'}).join('')}

function dash(){var n=DB.features.length;
 var seg=[['Idea','#7C5CD6'],['Planned','#2F6BDB'],['In Progress','#1E9A5C'],['Ready','#8BC34A'],['Deferred','#8892A6']];
 var bar=seg.map(function(s){var c=count('status',s[0]);return c?'<div style="width:'+c/n*100+'%;background:'+s[1]+'"></div>':''}).join('');
 var imp=DB.features.filter(function(f){return f.priority==='Critical'||f.priority==='High'}).sort(function(a,b){return PRI.indexOf(a.priority)-PRI.indexOf(b.priority)}).slice(0,5);
 var rec=DB.features.slice().sort(function(a,b){return b.updated.localeCompare(a.updated)}).slice(0,5);
 return '<div class="top"><div><h1>Dashboard</h1><div class="sub">Feature planning overview · ফিচার পরিকল্পনা</div></div><button class="btn gold" data-act="add">+ Add feature</button></div>'+
 '<div class="g4"><div class="card"><div class="sub">Total features</div><div class="big">'+n+'</div></div>'+PHA.map(function(p){return'<div class="card"><div class="sub">'+p+'</div><div class="big">'+count('phase',p)+'</div></div>'}).join('')+'</div>'+
 '<div class="g2"><div class="card"><h2>Status progress</h2><div class="bar" role="img" aria-label="Status distribution">'+bar+'</div>'+STA.map(function(s){return'<div class="row"><span class="badge s-'+cls(s)+'">'+s+'</span><b>'+count('status',s)+'</b></div>'}).join('')+'</div>'+
 '<div class="card"><h2>Features by module</h2>'+MODS.map(function(m){return'<div class="row"><span>'+esc(m)+'<br><span class="sub">'+MODBN[m]+'</span></span><b>'+count('module',m)+'</b></div>'}).join('')+'</div></div>'+
 '<div class="g2"><div class="card"><h2>Important features</h2>'+(imp.length?imp.map(function(f){return'<div class="row"><span>'+esc(f.name)+'</span><span class="tags"><span class="badge b-'+f.priority+'">'+f.priority+'</span><span class="badge p-'+cls(f.phase)+'">'+f.phase+'</span></span></div>'}).join(''):'<div class="empty">None yet</div>')+'</div>'+
 '<div class="card"><h2>Recently added or edited</h2>'+(rec.length?rec.map(function(f){return'<div class="row"><span>'+esc(f.name)+'</span><span class="sub">'+ago(f.updated)+'</span></div>'}).join(''):'<div class="empty">None yet</div>')+'</div></div>'+
 '<div class="warn"><b>Integrations:</b> Google Classroom, Calendar, Drive and Gmail are only <b>Planned</b>. They need official APIs and the OAuth consent flow; nothing is connected. এখনও কোনো integration সংযুক্ত নয়।</div>'}

function list(){var q=Q.q.toLowerCase();
 var r=DB.features.filter(function(f){return(!Q.module||f.module===Q.module)&&(!Q.priority||f.priority===Q.priority)&&(!Q.status||f.status===Q.status)&&(!Q.phase||f.phase===Q.phase)&&(!q||(f.name+' '+f.nameBn+' '+f.desc+' '+f.audience+' '+f.notes).toLowerCase().indexOf(q)>-1)});
 r.sort(function(a,b){return Q.sort==='name'?a.name.localeCompare(b.name):Q.sort==='priority'?PRI.indexOf(a.priority)-PRI.indexOf(b.priority):b.updated.localeCompare(a.updated)});
 var cards=r.length?r.map(function(f){return'<article class="card fcard"><div class="fh"><div><b>'+esc(f.name)+'</b><div lang="bn" class="sub">'+esc(f.nameBn)+'</div></div><div class="tags">'+badges(f)+'</div></div><div>'+esc(f.desc)+'</div><div class="sub">'+esc(f.module)+' · '+esc(f.audience)+' · Updated '+ago(f.updated)+'</div>'+(f.notes?'<div class="sub"><b>Notes:</b> '+esc(f.notes)+'</div>':'')+'<div class="acts"><button class="btn ghost sm" data-act="edit" data-id="'+f.id+'">Edit</button><button class="btn ghost sm" data-act="del" data-id="'+f.id+'">Delete</button></div></article>'}).join(''):'<div class="card empty">No features match. Change the filters or add a feature.<br>কোনো ফিচার পাওয়া যায়নি।</div>';
 return '<div class="top"><div><h1>Features</h1><div class="sub">'+r.length+' of '+DB.features.length+' shown</div></div><button class="btn gold" data-act="add">+ Add feature</button></div>'+
 '<div class="card"><div class="filters"><div><label class="sub" for="q">Search</label><input id="q" type="search" value="'+esc(Q.q)+'" placeholder="Search / খুঁজুন"></div>'+
 [['module','Module',MODS],['priority','Priority',PRI],['status','Status',STA],['phase','Phase',PHA]].map(function(x){return'<div><label class="sub" for="fl-'+x[0]+'">'+x[1]+'</label><select id="fl-'+x[0]+'" data-fl="'+x[0]+'">'+opts(x[2],Q[x[0]],'All')+'</select></div>'}).join('')+
 '<div><label class="sub" for="fl-sort">Sort</label><select id="fl-sort" data-fl="sort"><option value="updated"'+(Q.sort==='updated'?' selected':'')+'>Recently updated</option><option value="name"'+(Q.sort==='name'?' selected':'')+'>Name</option><option value="priority"'+(Q.sort==='priority'?' selected':'')+'>Priority</option></select></div></div></div>'+
 '<div class="g2">'+cards+'</div>'}

function modules(){return '<div><h1>Modules</h1><div class="sub">Three product areas · তিনটি পণ্য ক্ষেত্র</div></div><div class="g2">'+MODS.map(function(m){var fs=DB.features.filter(function(f){return f.module===m});
 return'<section class="card"><h2>'+esc(m)+'</h2><div class="sub" lang="bn">'+MODBN[m]+'</div><div class="tags" style="margin:10px 0"><span class="badge p-MVP">MVP '+fs.filter(function(f){return f.phase==='MVP'}).length+'</span><span class="badge p-Phase2">Phase 2 '+fs.filter(function(f){return f.phase==='Phase 2'}).length+'</span><span class="badge p-Future">Future '+fs.filter(function(f){return f.phase==='Future'}).length+'</span></div>'+
 fs.map(function(f){return'<div class="row"><span>'+esc(f.name)+'</span><span class="badge s-'+cls(f.status)+'">'+f.status+'</span></div>'}).join('')+'<div class="acts" style="margin-top:10px"><button class="btn ghost sm" data-act="modfilter" data-m="'+esc(m)+'">View in Features</button></div></section>'}).join('')+'</div>'}

function settings(){return '<div><h1>Settings / Project Setup</h1></div>'+
 '<div class="warn"><b>Local planning tool.</b> No login, no server. Data is kept in this browser only. It is not a secured multi-user system, and the roles below are <b>intended permissions only, not enforced</b>.</div>'+
 '<div class="card"><h2>Intended roles</h2><div class="tw"><table><tr><th>Role</th><th>Timetable</th><th>Notice board</th><th>Features here</th></tr>'+
 '<tr><td>Admin</td><td>Create, edit, delete</td><td>Manage all</td><td>Full</td></tr><tr><td>Editor</td><td>Create, edit</td><td>View</td><td>Edit</td></tr><tr><td>Teacher</td><td>View</td><td>Publish, manage own</td><td>View</td></tr><tr><td>Student</td><td>View</td><td>View</td><td>None</td></tr></table></div></div>'+
 '<div class="card"><h2>Privacy and integrations</h2><p class="sub">Collect the minimum personal data for children and students. Google integrations use only official APIs with OAuth consent; no secrets or tokens in the page source.</p></div>'+
 '<div class="card"><h2>Data</h2><div class="acts"><button class="btn ghost" data-act="export">Export JSON</button><button class="btn ghost" data-act="reseed">Add missing seed features</button><button class="btn red" data-act="reset">Reset all data</button></div><p class="sub" id="dmsg" role="status"></p></div>'}

function render(){var m=document.getElementById('main');m.innerHTML={dash:dash,features:list,modules:modules,settings:settings}[view]();
 document.querySelectorAll('.nav').forEach(function(b){if(b.dataset.v===view)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')})}
function go(v){view=v;render();window.scrollTo(0,0)}

function openForm(id){editing=id;var f=id?DB.features.filter(function(x){return x.id===id})[0]:{name:'',nameBn:'',desc:'',module:MODS[0],priority:'Medium',status:'Idea',phase:'MVP',audience:'',notes:''};
 document.getElementById('dt').textContent=id?'Edit feature':'Add feature';
 document.getElementById('f-module').innerHTML=opts(MODS,f.module);document.getElementById('f-priority').innerHTML=opts(PRI,f.priority);document.getElementById('f-status').innerHTML=opts(STA,f.status);document.getElementById('f-phase').innerHTML=opts(PHA,f.phase);
 ['name','nameBn','desc','audience','notes'].forEach(function(k){document.getElementById('f-'+k).value=f[k]||''});
 ['name','desc','audience'].forEach(function(k){document.getElementById('e-'+k).textContent='';document.getElementById('f-'+k).removeAttribute('aria-invalid')});
 document.getElementById('dlg').showModal();document.getElementById('f-name').focus()}
function v(k){return document.getElementById('f-'+k).value.trim()}
document.getElementById('form').addEventListener('submit',function(e){e.preventDefault();var ok=true;
 var chk={name:'Name is required.',desc:'Description is required.',audience:'Target audience is required.'};
 Object.keys(chk).forEach(function(k){var bad=!v(k);document.getElementById('e-'+k).textContent=bad?chk[k]:'';if(bad){ok=false;document.getElementById('f-'+k).setAttribute('aria-invalid','true')}else document.getElementById('f-'+k).removeAttribute('aria-invalid')});
 if(!ok){var first=document.querySelector('#form [aria-invalid]');if(first)first.focus();return}
 var now=new Date().toISOString(),d={name:v('name'),nameBn:v('nameBn'),desc:v('desc'),module:v('module'),priority:v('priority'),status:v('status'),phase:v('phase'),audience:v('audience'),notes:v('notes'),updated:now};
 if(editing){DB.features.forEach(function(f){if(f.id===editing)Object.assign(f,d)})}else{d.id='f-'+Date.now().toString(36)+Math.random().toString(36).slice(2,5);d.created=now;DB.features.push(d)}
 save();document.getElementById('dlg').close();render()});
document.getElementById('cancel').onclick=function(){document.getElementById('dlg').close()};
document.getElementById('delno').onclick=function(){document.getElementById('del').close()};
document.getElementById('delyes').onclick=function(){DB.features=DB.features.filter(function(f){return f.id!==delId});save();document.getElementById('del').close();render()};

document.addEventListener('click',function(e){var b=e.target.closest('[data-act],[data-v]');if(!b)return;
 if(b.dataset.v){go(b.dataset.v);return}
 var a=b.dataset.act,id=b.dataset.id;
 if(a==='add')openForm(null);
 else if(a==='edit')openForm(id);
 else if(a==='del'){delId=id;var f=DB.features.filter(function(x){return x.id===id})[0];document.getElementById('delp').textContent='“'+f.name+'” will be removed permanently.';document.getElementById('del').showModal()}
 else if(a==='modfilter'){Q.module=b.dataset.m;go('features')}
 else if(a==='export'){var u=URL.createObjectURL(new Blob([JSON.stringify(DB.features,null,2)],{type:'application/json'}));var l=document.createElement('a');l.href=u;l.download='features.json';l.click();document.getElementById('dmsg').textContent='Export started if your browser allows downloads.'}
 else if(a==='reseed'){var have={};DB.features.forEach(function(f){have[f.id]=1});var n=0;SEED.forEach(function(s){if(!have[s.id]){DB.features.push(s);n++}});save();document.getElementById('dmsg').textContent=n?n+' seed feature(s) added.':'Nothing missing; no duplicates were created.'}
 else if(a==='reset'){if(confirm('Delete all features and restore the seed data?')){DB={features:[],seeded:''};load();render()}}});
document.addEventListener('input',function(e){if(e.target.id==='q'){Q.q=e.target.value;var p=e.target.selectionStart;render();var q=document.getElementById('q');q.focus();q.setSelectionRange(p,p)}});
document.addEventListener('change',function(e){if(e.target.dataset.fl){Q[e.target.dataset.fl]=e.target.value;var id=e.target.id;render();document.getElementById(id).focus()}});
load();render();
