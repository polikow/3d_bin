export namespace packing {
	
	export class Container {
	    w: number;
	    h: number;
	    l: number;
	
	    static createFrom(source: any = {}) {
	        return new Container(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.w = source["w"];
	        this.h = source["h"];
	        this.l = source["l"];
	    }
	}
	export class Block {
	    w: number;
	    h: number;
	    l: number;
	
	    static createFrom(source: any = {}) {
	        return new Block(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.w = source["w"];
	        this.h = source["h"];
	        this.l = source["l"];
	    }
	}
	export class Point {
	    x: number;
	    y: number;
	    z: number;
	
	    static createFrom(source: any = {}) {
	        return new Point(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.x = source["x"];
	        this.y = source["y"];
	        this.z = source["z"];
	    }
	}
	export class BlockPosition {
	    // Go type: Point
	    p1: any;
	    // Go type: Point
	    p2: any;
	
	    static createFrom(source: any = {}) {
	        return new BlockPosition(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.p1 = this.convertValues(source["p1"], null);
	        this.p2 = this.convertValues(source["p2"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class IndexRotation {
	    index: number;
	    rotation: number;
	
	    static createFrom(source: any = {}) {
	        return new IndexRotation(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.index = source["index"];
	        this.rotation = source["rotation"];
	    }
	}
	export class SearchResult {
	    iteration: number;
	    value: number;
	    solution: IndexRotation[];
	    packed: BlockPosition[];
	
	    static createFrom(source: any = {}) {
	        return new SearchResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.iteration = source["iteration"];
	        this.value = source["value"];
	        this.solution = this.convertValues(source["solution"], IndexRotation);
	        this.packed = this.convertValues(source["packed"], BlockPosition);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Task {
	    container: Container;
	    blocks: Block[];
	
	    static createFrom(source: any = {}) {
	        return new Task(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.container = this.convertValues(source["container"], Container);
	        this.blocks = this.convertValues(source["blocks"], Block);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class BCASettings {
	    np: number;
	    ni: number;
	    ci: number;
	
	    static createFrom(source: any = {}) {
	        return new BCASettings(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.np = source["np"];
	        this.ni = source["ni"];
	        this.ci = source["ci"];
	    }
	}
	export class GASettings {
	    np: number;
	    mp: number;
	    ni: number;
	    evolution: string;
	
	    static createFrom(source: any = {}) {
	        return new GASettings(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.np = source["np"];
	        this.mp = source["mp"];
	        this.ni = source["ni"];
	        this.evolution = source["evolution"];
	    }
	}
	export class Progress {
	    stepsDone: number;
	    stepsTotal: number;
	
	    static createFrom(source: any = {}) {
	        return new Progress(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.stepsDone = source["stepsDone"];
	        this.stepsTotal = source["stepsTotal"];
	    }
	}
	export class MultipleSearchResult {
	    iteration: number;
	    value: number;
	    solution: IndexRotation[];
	    packed: BlockPosition[];
	    statuses: Progress[];
	
	    static createFrom(source: any = {}) {
	        return new MultipleSearchResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.iteration = source["iteration"];
	        this.value = source["value"];
	        this.solution = this.convertValues(source["solution"], IndexRotation);
	        this.packed = this.convertValues(source["packed"], BlockPosition);
	        this.statuses = this.convertValues(source["statuses"], Progress);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

