// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {packing} from '../models';

export function Generate(arg1:packing.Container):Promise<Array<packing.Block>|Error>;

export function LoadTask():Promise<packing.Task|Error>;

export function RunBCA(arg1:packing.Task,arg2:packing.BCASettings,arg3:number):Promise<Error>;

export function RunGA(arg1:packing.Task,arg2:packing.GASettings,arg3:number):Promise<Error>;

export function TSFix(arg1:packing.MultipleSearchResult):void;

export function AvailableCPUs():Promise<number>;

export function LoadSearchResult():Promise<packing.SearchResult|Error>;

export function SaveSearchResult(arg1:packing.SearchResult):Promise<Error>;

export function SaveTask(arg1:packing.Task):Promise<Error>;
