

export const filterBookmarks = (collections: chrome.bookmarks.BookmarkTreeNode[]) => {
    if (collections.length <= 0) return [];
    return collections.filter(cl => {
        return isBookmark(cl);
    })
}
export const filterCollections = (collections: chrome.bookmarks.BookmarkTreeNode[]) => {
    if (collections.length <= 0) return [];
    return collections.filter(cl => {
        return isCollection(cl);
    })
}

export const isBookmark = (bookmark: chrome.bookmarks.BookmarkTreeNode) => {
    return Object.keys(bookmark).includes('url');
}

export const isCollection = (bookmark: chrome.bookmarks.BookmarkTreeNode) => {
    return !Object.keys(bookmark).includes('url');
}

export const isBookmarkBelongsCollection = (collection: chrome.bookmarks.BookmarkTreeNode, bookmark: chrome.bookmarks.BookmarkTreeNode) => {
    if (!isCollection(collection)) return false;
    if (!isBookmark(bookmark)) return false;
    return collection.id === bookmark.parentId;
}

export const parseTitleUrlFromDragEvent = (ev: React.DragEvent) => {
    const link = ev.dataTransfer.getData('text/uri-list');
    const eleStr = ev.dataTransfer.getData('text/html');
    const elem = new DOMParser().parseFromString(eleStr, 'text/html');
    const title = '';
    const out: any = {};
 
    const aTag = elem.querySelector('a');
    const img = elem.querySelector('img');

    if(aTag){
        let title = aTag.textContent;
       const res = title && (title.trim() !== '') ? {
        title,
        url: link
       }: null
       return res
    }

    if(img){
        let title = img.getAttribute('alt');
        // console.log("Image found", title);
        const res = title && (title.trim() !== '') ? {
            title,
            url: link
           }: null
        return res;
    }
}

export const collectNodes = (nodes: chrome.bookmarks.BookmarkTreeNode[]) => {
    const collectedNodes: chrome.bookmarks.BookmarkTreeNode[] = [];
    nodes.forEach(node => {
        if(isCollection(node)){
            collectedNodes.push(node);
            if(node.children && node.children.length > 0){
                collectedNodes.push(...collectNodes(node.children));
            }
        }
    });
    return collectedNodes;
}
export const getTreeList = async() => {
    try {
        const tree = await chrome.bookmarks.getTree();
        const nodeList = collectNodes(tree[0].children!);
        return nodeList;
    } catch (error) {
        throw error;
    }
}