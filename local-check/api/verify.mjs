import {verifyEvidence} from '../server/verify.mjs';
export function POST(request){return verifyEvidence(request,process.env);}
export function OPTIONS(request){return verifyEvidence(request,process.env);}
export function GET(request){return verifyEvidence(request,process.env);}
