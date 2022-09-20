import {nanoid}  from 'nanoid';
import Storage from './AppStorage';
import AppEvent from './Events';

export type QuickAccessContent = {
    id: string;
    title: string;
    favicon: string;
    url: string;
    index: number;
}

export type CreateQuickAccess = {
    title: string;
    url: string,
    favicon: string
}

const QA_KEY = 'quick-access';
const QA_CREATED_EVENT_KEY = 'qa_created';
const QA_REMOVED_EVENT_KEY = 'qa_removed';



export async function create(qaa: CreateQuickAccess){
    try {
        let list = await getAll();
        let newQa: QuickAccessContent = {
            ...qaa,
            index: list.length+1,
            id: nanoid(5)
        }
        let newList: any = {};
        list.push(newQa);
        newList[QA_KEY] = list;
        // console.log("New List",newList);
        await Storage.set(newList);
        AppEvent.publish(QA_CREATED_EVENT_KEY, newQa);
        return list;
    } catch (error) {
        throw error;
    }
}

export async function getAll(){
    try {
        const list = await Storage.get(QA_KEY);
        if(Object.keys(list).length <= 0) return [] as QuickAccessContent[];
        // console.log("Getall::", list)
        return list[QA_KEY] as QuickAccessContent[];
    } catch (error) {
        throw error;
    }
}

export async function get(id: string){
    try {
        const list = await getAll();
        return list.find(qa => qa.id === id)
    } catch (error) {
        throw error;
    }
}

export async function getByUrl(url: string){
    try {
        const list = await getAll();
        return list.find(qa => qa.url === url)
    } catch (error) {
        throw error;
    }
}

export async function remove(id: string){
    try {
        let list = await getAll();
        const isExist = list.find(qa => qa.id === id);
        if(!isExist) return;
        let newList: any = {};
        newList[QA_KEY] = list.filter(qa => qa.id !== id)
        await Storage.set(newList);
        AppEvent.publish(QA_REMOVED_EVENT_KEY, isExist);
    } catch (error) {
        throw error;
    }
}

export async function empty(){
    try {
        return await Storage.remove(QA_KEY);

    } catch (error) {
        throw error;
    }
}

export const onCreated = {
    addListener: (callback?: (qa: QuickAccessContent) => void) => {
        AppEvent.subscribe(QA_CREATED_EVENT_KEY, ({detail}: any) => {
            callback && callback(detail);
        })
    },
    removeListner: (handler: (qa: QuickAccessContent) => void) => {
        AppEvent.unsubscribe(QA_CREATED_EVENT_KEY, handler);
    }
}
export const onRemoved = {
    addListener: (callback?: (qa: QuickAccessContent) => void) => {
        AppEvent.subscribe(QA_REMOVED_EVENT_KEY, ({detail}: any) => {
            callback && callback(detail);
        })
    },
    removeListner: (handler: (qa: QuickAccessContent) => void) => {
        AppEvent.unsubscribe(QA_REMOVED_EVENT_KEY, handler);
    }
}

const QuickAccess = {
    get,
    remove,
    getAll,
    create,
    empty,
    getByUrl,
    onCreated,
    onRemoved
}

export default QuickAccess;

