import * as models from './models';

export interface go {
  "main": {
    "App": {
		Generate(arg1:models.Container):Promise<Array<models.Block>|Error>
		LoadSearchResult():Promise<models.SearchResult|Error>
		LoadTask():Promise<models.Task|Error>
		RunBCA(arg1:models.Task,arg2:models.BCASettings):Promise<Error>
		RunGA(arg1:models.Task,arg2:models.GASettings):Promise<Error>
		SaveSearchResult(arg1:models.SearchResult):Promise<Error>
		SaveTask(arg1:models.Task):Promise<Error>
    },
  }

}

declare global {
	interface Window {
		go: go;
	}
}
