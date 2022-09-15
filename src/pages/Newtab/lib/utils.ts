

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