chrome.contextMenus.create({
    id: 'tbmctx1',
    contexts: ['all'],
    type: "normal",
    title: "Add to quick access",
    
  }, () => {
    console.log("Context menu created");
  })

  
