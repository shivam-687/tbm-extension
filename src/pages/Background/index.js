import QuickAccess from '../Newtab/lib/QuickAccess';


  chrome.contextMenus.create({
    id: 'tbmctx1',
    contexts: ['page'],
    type: "normal",
    title: "Add to quick access",
    
  }, () => {
    console.log("Context menu created");
  })



  async function saveInQuickAccess(data){
    console.log("Context menu saveInquick access");
    try {
      const tab = await chrome.tabs.getCurrent();
      await QuickAccess.create({title: tab.title, url: tab.url}).then((value) => {
        console.log("Quick access created: ", value);
      });
    } catch (error) {
      console.log("Error:: ", error);
    }
  }

  chrome.contextMenus.onClicked.addListener( (clickData) => {
    console.log("Context menu clicked", clickData);
    if(clickData.menuItemId === "tbmctx1"){
      saveInQuickAccess(clickData);
    }
})

  
