import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
// Run: npm install --no-save playwright && node scripts/console-browser-check.mjs
// Start Vite with VITE_API_BASE_URL=http://localhost:5173. All /api calls are mocked.
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:1440,height:1000},permissions:['clipboard-read','clipboard-write']});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await context.addInitScript(()=>{ if (!sessionStorage.getItem('fixture:signed-out')) localStorage.setItem('authToken','test-fixture-token'); });
const source={id:'evt-push',service:'checkout',environment:'prod',type:'deployment',occurred_at:'2026-10-04T10:00:00.000Z',summary:'Deploy checkout',source:'github',meta:{after_commit:'abc',commit:'abc',repo_full_name:'org/repo'}};
const deploy={...source,id:'evt-created',occurred_at:'2026-10-04T10:00:30.000Z',summary:'Deployment created (Production)',meta:{commit:'abc',deployment_id:12,repo_full_name:'org/repo'}};
const success={...deploy,id:'evt-success',environment:'Production',summary:'Deployment success',meta:{...deploy.meta,state:'success'}};
const events=[success,deploy,source];
const report={id:'report-1',title:'Checkout incident',severity:'HIGH',incident_at:'2026-10-04T10:01:00Z',executive_summary:'Investigate PRIMARY_CULPRIT',primary_cause_headline:'PRIMARY_CULPRIT checkout',action_items_json:[{priority:'P0',title:'Verify deploy',owner:'@oncall-sre'},{priority:'P1',title:'Add tests',owner:'@devops-team'}],timeline_json:[{timestamp:source.occurred_at,summary:source.summary,event_type:'deployment',service:'checkout',impact_level:'PRIMARY_CULPRIT'},{timestamp:'invalid',summary:'Unknown',impact_level:'CONTRIBUTING'}],markdown_report:'OLD PRIMARY_CULPRIT @oncall-sre'};
const factor={name:'Timing',score:85,weight:0.3,description:'Change occurred before incident',evidence:[{event_id:'evt-push',label:'Commit event'},'No causal proof']};
let servicesMode='normal';let widgetRequests=0;
await page.route('**/*',async route=>{
 const url=new URL(route.request().url());
 if(url.pathname.includes('helploom'))widgetRequests++;
 if(!url.pathname.startsWith('/api/')){await route.continue();return;}
 let data=[];let response={success:true,data};
 if(url.pathname==='/api/auth/github/callback')response={exists:true,data:{token:'fixture-oauth-token'}};
 if(url.pathname==='/api/organization')response.data={id:'org-1',name:'Fixture workspace'};
 if(url.pathname==='/api/organizations/services'){
  if(servicesMode==='loading')await new Promise(r=>setTimeout(r,1500));
  if(servicesMode==='error'){await route.fulfill({status:500,contentType:'application/json',body:JSON.stringify({message:'Fixture failure'})});return;}
  response.data=servicesMode==='empty'?[]:[{id:'svc-1',service_name:'checkout',criticality_tier:'tier1'}];
 }
 if(url.pathname==='/api/change-events')response={success:true,data:events,pagination:{total:3,limit:10,offset:0}};
 if(url.pathname==='/api/v1/postmortem')response.data=[report];
 if(url.pathname==='/api/integrations/github')response.data={status:'active'};
 if(url.pathname.includes('/api/api-keys'))response.data=[];
 if(url.pathname==='/api/scoring/incident')response.data={overall_assessment:{score:94,level:'high',explanation:'Ranked from API factors',factors:[factor]},individual_scores:[{event:source,role:'primary',risk_assessment:{score:92,level:'high',explanation:'Investigate timing',factors:[factor]}}]};
 await route.fulfill({contentType:'application/json',body:JSON.stringify(response)});
});
fs.mkdirSync('/tmp/console-screens',{recursive:true});
const shot=async name=>{ await page.addStyleTag({content:"*, *::before, *::after { animation: none !important; transition: none !important; } .animate-fade-in {opacity:1 !important;}"}); return page.screenshot({path:`/tmp/console-screens/${name}.png`,fullPage:true}); };
await page.goto('http://localhost:5173/sandbox');
await page.getByText('Why 94? View demo evidence').click();
await page.getByText('Why this demo risk score?').click();
assert.equal(await page.getByRole('link',{name:'Start with your own data'}).count(),1);
await shot('sandbox-rewind');
for(const tab of ['Telemetry Feed','Services & Keys','Ingestion Channels']){
 await page.getByRole('button',{name:tab,exact:true}).click();
 assert.equal(await page.getByRole('link',{name:'Start with your own data'}).count(),1);
 if(tab==='Telemetry Feed'){await page.getByText('Score rationale').first().click();await shot('sandbox-telemetry');}
 if(tab==='Services & Keys')await shot('sandbox-services');
}
await page.getByRole('button',{name:/GitHub Webhooks/}).focus();await page.keyboard.press('Enter');
await page.getByRole('heading',{name:'GitHub setup is available in your workspace'}).waitFor();
await shot('sandbox-setup');
await page.getByRole('link',{name:'Open real GitHub setup'}).click();
await page.getByText('GitHub Webhooks', {exact:true}).first().waitFor();
assert.match(page.url(),/integrations\?channel=github/);await shot('real-setup');
await page.goto('http://localhost:5173/integrations');
await page.getByRole('button',{name:'Configure GitHub Webhooks'}).focus();await page.keyboard.press('Enter');await page.getByText('GitHub Webhooks',{exact:true}).first().waitFor();
await page.goto('http://localhost:5173/events');
await page.getByText(/deployment lifecycle.*associated push events/) .waitFor();
await page.getByText(/deployment lifecycle.*associated push events/) .click();
assert.equal(await page.locator('a[href="/events/evt-created"]').count(),1);assert.equal(await page.locator('a[href="/events/evt-push"]').count(),1);await shot('grouped-events');
await page.goto('http://localhost:5173/rewind');await page.getByRole('button',{name:'Analyze latest event',exact:true}).click();
await page.getByText('Overall risk score: rationale and evidence').waitFor();await page.getByText('Overall risk score: rationale and evidence').click();await shot('rewind-brief');
await page.getByRole('button',{name:/Full Breakdown/}).click();await page.getByText('Selected change: rationale and source evidence').waitFor();await page.getByText('Selected change: rationale and source evidence').click();await page.getByRole('button',{name:/Why this score/}).click();assert.equal(await page.getByRole('link',{name:'Commit event',exact:true}).count(),2);await shot('rewind-detailed');
await page.goto('http://localhost:5173/postmortems');await page.getByLabel('Action owner 1').waitFor();
assert.equal(await page.getByLabel('Action owner 1').inputValue(),'');await page.getByLabel('Action owner 1').fill('Kishan');await page.getByLabel('Action owner 2').fill('Sam');await page.getByRole('checkbox',{name:/I have reviewed/}).check();
await page.getByRole('link',{name:'Inspect source event',exact:true}).waitFor();assert.equal(await page.getByText('PRIMARY_CULPRIT',{exact:false}).count(),0);
await page.getByRole('button',{name:'Copy Markdown'}).click();const clipboard=await page.evaluate(()=>navigator.clipboard.readText());assert.match(clipboard,/Owner: Kishan/);assert.match(clipboard,/2026-10-04 10:00:00.000 UTC/);assert(!clipboard.includes('PRIMARY_CULPRIT'));await shot('postmortem-reviewed');
for(const path of ['topology','postmortems']){
 servicesMode='loading';await page.goto(`http://localhost:5173/${path}`);await page.getByRole('status').filter({hasText:'Loading services'}).waitFor();assert.equal(await page.getByText('No Services Ingested Yet').count(),0);await shot(`${path}-loading`);await page.getByText('Loading services...', {exact:true}).waitFor({state:'hidden'});
 servicesMode='error';await page.goto(`http://localhost:5173/${path}`);await page.getByRole('button',{name:'Retry services'}).waitFor();await shot(`${path}-error`);
 servicesMode='empty';await page.getByRole('button',{name:'Retry services'}).click();await page.getByText(/No Services Ingested Yet|Topology Preview Mode/).waitFor();await shot(`${path}-empty`);
}
// Logged-out demo -> sign-in -> existing-user OAuth callback preserves setup.
await page.evaluate(()=>{ localStorage.removeItem('authToken'); sessionStorage.setItem('fixture:signed-out','true'); });
await page.goto('http://localhost:5173/sandbox');
await page.getByRole('link',{name:'Start with your own data'}).click();assert.match(page.url(),/login\?setup=github/);
assert.equal(await page.evaluate(()=>sessionStorage.getItem('lastgood:after-login')),'/integrations?channel=github');
await page.goto('http://localhost:5173/auth/callback/github?code=fixture-code');
await page.getByRole('heading',{name:'GitHub Webhooks',exact:true}).waitFor();assert.match(page.url(),/integrations\?channel=github/);
assert.equal(await page.evaluate(()=>sessionStorage.getItem('lastgood:after-login')),null);
assert.equal(widgetRequests,0);assert.deepEqual(errors,[]);
console.log('PASS: sandbox CTA in all views; evidence; keyboard config; real setup; grouping; risk breakdown; report owner export; loading/error/empty states; no support auto-load; no runtime errors.');
await browser.close();
