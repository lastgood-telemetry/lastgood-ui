import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const server = spawn('node', ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1'], {env:{...process.env,VITE_API_BASE_URL:'http://127.0.0.1:5173'},stdio:'inherit'});
let browser;
try {
 browser = await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>{errors.push(e.message);console.log(e.message)});
 let full=false, conflict=false, calls=0, hold=false;
 await page.route('**/api/**',async route=>{
  const path=new URL(route.request().url()).pathname;
  if(!path.startsWith('/api/')) {await route.continue();return;}
  let data={success:true,data:[]};
  if(path.includes('count')) data={success:true,data:{count:full?20:3}};
  if(path.includes('/auth/github/callback')) data={exists:false,email:'jane@example.com',name:'Jane Doe'};
  if(path.includes('/auth/oauth-signup')) {
   calls++; if(hold)await new Promise(r=>setTimeout(r,600));
   if(conflict){await route.fulfill({status:409,contentType:'application/json',body:JSON.stringify({message:'Workspace slug is already in use.'})});return;}
   data={success:true,data:{token:'fixture-token'}};
  }
  await route.fulfill({contentType:'application/json',body:JSON.stringify(data)});
 });
 fs.mkdirSync('/tmp/onboarding-screens',{recursive:true});
 for(const width of [390,1280]) {
  await page.setViewportSize({width,height:width===390?844:1000});
  await page.goto('http://127.0.0.1:5173/login');await page.getByRole('button',{name:'Continue with GitHub'}).waitFor();
  await page.screenshot({path:`/tmp/onboarding-screens/login-${width}.png`,fullPage:true});
  await page.goto('http://127.0.0.1:5173/auth/callback/github?code=fixture');
  await page.getByRole('heading',{name:'Make it your workspace.'}).waitFor();
  assert.equal(await page.getByLabel('Account email').inputValue(),'jane@example.com');
  await page.addStyleTag({content:'.fixed.bottom-4 { visibility:hidden !important; }'});await page.screenshot({path:`/tmp/onboarding-screens/profile-${width}.png`,fullPage:true});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 }
 await page.getByLabel('Your name').fill('');await page.getByRole('button',{name:'Create workspace',exact:true}).click();
 await page.getByText('Enter your name.',{exact:true}).waitFor();assert.equal(calls,0);
 
 await page.getByLabel('Your name').fill('Jane');await page.getByLabel('Workspace name',{exact:true}).fill('Acme Team');
 assert.equal(await page.getByLabel('Workspace slug',{exact:true}).inputValue(),'acme-team');
 await page.getByLabel('Workspace slug',{exact:true}).fill('custom');await page.getByLabel('Workspace name',{exact:true}).fill('New Team');
 assert.equal(await page.getByLabel('Workspace slug',{exact:true}).inputValue(),'custom');
 await page.getByLabel('Workspace slug',{exact:true}).fill('-bad-');await page.getByRole('button',{name:'Create workspace',exact:true}).click();assert.equal(calls,0);
 await page.getByLabel('Workspace slug',{exact:true}).fill('taken');conflict=true;
 await page.getByRole('button',{name:'Create workspace',exact:true}).click();await page.locator('#org_slug-error').waitFor();
 await page.screenshot({path:'/tmp/onboarding-screens/profile-conflict.png',fullPage:true});
 conflict=false;hold=true;
 await page.getByLabel('Workspace slug',{exact:true}).fill('unique');
 await page.evaluate(()=>sessionStorage.setItem('lastgood:after-login','/integrations?channel=github'));
 await page.getByRole('button',{name:'Create workspace',exact:true}).click();await page.getByRole('button',{name:'Creating workspace...'}).waitFor();
 assert.equal(await page.getByLabel('Workspace name',{exact:true}).isDisabled(),true);
 await page.waitForURL('**/integrations?channel=github');assert.equal(await page.evaluate(()=>localStorage.getItem('authToken')),'fixture-token');
 await page.evaluate(()=>localStorage.clear());full=true;
 await page.goto('http://127.0.0.1:5173/auth/callback/github?code=fixture');await page.getByRole('button',{name:'Beta signup paused'}).waitFor();
 assert.equal(await page.getByRole('button',{name:'Beta signup paused'}).isDisabled(),true);
 await page.goto('http://127.0.0.1:5173/login');await page.goto('http://127.0.0.1:5173/signup/complete-profile');await page.waitForURL('**/login');
 await page.goto('http://127.0.0.1:5173/login?testMode=true');await page.getByRole('button',{name:'Sign In with Password'}).waitFor();
 assert.deepEqual(errors,[]);
 console.log('PASS: responsive auth; OAuth state; required fields; generated/manual slugs; conflict; loading; preserved setup destination; beta limit; invalid-session guard; test-mode sign-in; no runtime errors.');
} finally {await browser?.close();server.kill();}
