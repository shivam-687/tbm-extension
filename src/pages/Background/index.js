chrome.contextMenus.create({
    id: 'tbmctx1',
    contexts: ['page'],
    type: "normal",
    title: "Add to quick access",
    
  }, () => {
    console.log("Context menu created");
  })

  chrome.contextMenus.onClicked.addListener( (clickData) => {
    if(clickData.menuItemId === "tbmctx1"){
        // alert("clicked point in page 👏👏")
        console.log("Data clicked:", clickData);
    }
})

  
