import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import fs from 'node:fs';
// Install Playwright locally (without saving) and run node scripts/diagnosis-browser-check.mjs.
fs.writeFileSync('qa-terminal.html', '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1.0"></head><body><div id="root"></div><script type="module" src="/qa-terminal.jsx"></script></body></html>\n');
fs.writeFileSync('qa-terminal.jsx', "import React from 'react';\nimport { createRoot } from 'react-dom/client';\nimport { QueryClient, QueryClientProvider } from '@tanstack/react-query';\nimport { BrowserRouter } from 'react-router-dom';\nimport dayjs from 'dayjs';\nimport timezone from 'dayjs/plugin/timezone';\nimport relativeTime from 'dayjs/plugin/relativeTime';\ndayjs.extend(timezone);\ndayjs.extend(relativeTime);\nimport Rewind from './src/pages/Rewind';\nimport './src/index.css';\ncreateRoot(document.getElementById('root')).render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><BrowserRouter><Rewind /></BrowserRouter></QueryClientProvider>);\n");
const screenshots = process.env.QA_SCREENSHOT_DIR || '/tmp/diagnosis-screens';
fs.mkdirSync(screenshots, {recursive:true});
const server=spawn('npm',['run','dev','--','--host','127.0.0.1','--port','5173'],{cwd:process.cwd(),env:{...process.env,VITE_API_BASE_URL:'http://127.0.0.1:5173'},stdio:'ignore'});
const event={id:'event-1',occurred_at:'2026-10-07T07:00:00Z',service:'lastgood-be',environment:'prod',type:'deploy',summary:'Deploy f12fa3b: async diagnosis worker',meta:{author:'kishankr7979',commit:'f12fa3b'}};
const rules={status:'pending',stage:'rules',job_id:'qa-job',executive_summary:'A deployment to lastgood-be preceded the incident by five minutes. Investigate this change first; a timing match alone does not confirm the cause.',primary_cause_headline:'Recent deployment may be related',recommended_action:'Compare error rate and latency before and after deploy f12fa3b.'};
const result={ai_diagnosis:rules,individual_scores:[{role:'primary',event,risk_assessment:{score:78,recommendations:[]}}, {event:{...event,id:'event-2',summary:'Redis connection configuration updated'},risk_assessment:{score:54}},{event:{...event,id:'event-3',type:'feature_flag',summary:'Enable fast AI triage'},risk_assessment:{score:38}}],overall_assessment:{explanation:'Change timing and service scope rank these candidates for investigation.',recommendations:[]}};
(async()=>{
 let browser;
 try {
 for(let i=0;i<80;i++){try{if((await fetch('http://127.0.0.1:5173/qa-terminal.html')).ok)break}catch{}await new Promise(r=>setTimeout(r,100));}
 browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 let update={...rules},polls=0,run=0,expired=false,disabled=false;
 const errors=[];page.on('pageerror',e=>{errors.push(e.message);console.log('PAGE ERROR',e.message)});
 await page.route('**/api/**',async route=>{
 const url=route.request().url();if(!new URL(url).pathname.startsWith('/api/'))return route.continue();let body;
 if(url.includes('/change-events'))body={success:true,data:[event],pagination:{total:1}};
 else if(url.includes('/diagnosis/')) {if(expired)return route.fulfill({status:404,json:{success:false}});polls++;body={success:true,data:{ai_diagnosis:update}};}
 else if(url.includes('/scoring/incident')){run++;body={success:true,data:{...result,ai_diagnosis:{...rules,status:disabled?'disabled':'pending',job_id:run===1?'qa-job':'qa-new-job'}}};}
 else body={success:true,data:[]};
 await route.fulfill({json:body});
 });
 page.on('console', m=>console.log('console',m.type(),m.text()));
 await page.goto('http://127.0.0.1:5173/qa-terminal.html');

 await page.getByRole('button',{name:'Analyze latest event'}).click();
 await page.getByRole('status').filter({hasText:'AI diagnosis pending'}).waitFor();
 const terminal=page.getByRole('complementary',{name:'Diagnosis terminal'});
 await page.waitForFunction(()=>document.querySelector('aside [aria-hidden="true"].whitespace-pre-wrap')?.textContent.includes('does not confirm the cause.'));
 await page.screenshot({path:`${screenshots}/diagnosis-desktop-rules.png`,fullPage:true});
 update={...rules,stage:'triage',executive_summary:'Fast AI triage identifies the async-worker deployment as a candidate. Check the queue startup logs and compare the first failing request with the deployment timestamp.'};
 await page.getByRole('status').filter({hasText:'Deep analysis pending'}).waitFor();
 await page.waitForFunction(()=>document.querySelector('aside [aria-hidden="true"].whitespace-pre-wrap')?.textContent.includes('deployment timestamp.'));
 await page.screenshot({path:`${screenshots}/diagnosis-desktop-triage.png`,fullPage:true});
 update={...rules,status:'completed',stage:'deep',executive_summary:'The deployment is a plausible contributor, but the Redis recovery and intermittent provider timeouts suggest separate failure paths. Compare incident metrics against the change window before rolling back. Check worker logs for the affected job and verify the diagnosis endpoint returns a final result.'};
 await page.getByRole('status').filter({hasText:'Complete'}).waitFor();
 await page.waitForFunction(()=>document.querySelector('aside [aria-hidden="true"].whitespace-pre-wrap')?.textContent.includes('final result.'));
 assert((await terminal.innerText()).includes('Deep analysis received.'));
 const after=polls;await page.waitForTimeout(2700);assert.equal(polls,after,'Polling stops on completion');
 
 const boxes=await page.evaluate(()=>{const a=document.querySelector('aside');const b=document.querySelector('section[aria-label="Incident brief"]');return {a:a.getBoundingClientRect().toJSON(),b:b.getBoundingClientRect().toJSON()}});
 assert(boxes.a.x>boxes.b.x+300,'Desktop panel is on right');
 await page.screenshot({path:`${screenshots}/diagnosis-desktop-complete.png`,fullPage:true});
 await page.setViewportSize({width:390,height:844});
 const mobile=await page.evaluate(()=>({width:document.documentElement.scrollWidth,inner:innerWidth,aside:document.querySelector('aside').getBoundingClientRect().toJSON(),details:document.querySelector('section[aria-label="Incident brief"] details').getBoundingClientRect().toJSON()}));
 assert(mobile.width<=mobile.inner,'No mobile horizontal overflow');assert(mobile.aside.y>=mobile.details.bottom,'Mobile terminal stacks after investigation');
 await page.screenshot({path:`${screenshots}/diagnosis-mobile-complete.png`,fullPage:true});
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.setViewportSize({width:1440,height:1000});
 update={...rules,status:'failed'};run=0;await page.reload();
 await page.getByRole('button',{name:'Analyze latest event'}).click();
 await page.getByRole('status').filter({hasText:'Unavailable'}).waitFor();
 assert((await terminal.innerText()).includes(rules.executive_summary));
 await page.screenshot({path:`${screenshots}/diagnosis-desktop-failed.png`,fullPage:true});
 update={...rules,job_id:'qa-new-job',status:'completed',stage:'deep',executive_summary:'Fresh diagnosis after retry.'};
 await terminal.getByRole('button',{name:'Re-run diagnosis'}).click();
 await page.getByRole('status').filter({hasText:'Complete'}).waitFor();
 assert((await terminal.innerText()).includes('Fresh diagnosis after retry.'));
 expired=true;run=0;await page.reload();await page.getByRole('button',{name:'Analyze latest event'}).click();await page.getByRole('status').filter({hasText:'Expired'}).waitFor();assert(await terminal.getByRole('button',{name:'Re-run diagnosis'}).isVisible());
 expired=false;disabled=true;run=0;await page.reload();await page.getByRole('button',{name:'Analyze latest event'}).click();await page.getByRole('status').filter({hasText:'AI not enabled'}).waitFor();assert((await terminal.innerText()).includes('No executive summary returned'));
 assert.equal(errors.length,0,errors.join('\n'));
 console.log(JSON.stringify({polls,runs:run,mobile,desktop:boxes,checks:'rules -> triage -> deep, stop polling, failure -> rerun fresh UUID, expired, disabled, reduced motion, desktop split, mobile no overflow',errors},null,2));
 }finally{if(browser)await browser.close();server.kill();fs.rmSync('qa-terminal.html',{force:true});fs.rmSync('qa-terminal.jsx',{force:true});}
})().catch(e=>{console.error(e);process.exitCode=1});
