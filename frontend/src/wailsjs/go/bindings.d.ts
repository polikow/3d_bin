import * as models from './models';

export interface go {
  "main": {
    "App": {
		AvailableCPUs():Promise<number>
		Generate(arg1:models.Container):Promise<Array<models.Block>|Error>
		LoadSearchResult():Promise<models.SearchResult|Error>
		LoadTask():Promise<models.Task|Error>
		RunBCA(arg1:models.Task,arg2:models.BCASettings,arg3:number):Promise<Error>
		RunGA(arg1:models.Task,arg2:models.GASettings,arg3:number):Promise<Error>
		SaveSearchResult(arg1:models.SearchResult):Promise<Error>
		SaveTask(arg1:models.Task):Promise<Error>
		TSFix(arg1:models.MultipleSearchResult):Promise<void>
    },
  }

}

declare global {
	interface Window {
		go: go;
	}
}
