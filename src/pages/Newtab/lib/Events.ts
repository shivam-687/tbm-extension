

function subscribe(eventName: string, listener: any) {
    document.addEventListener(eventName, listener);
  }
  
  function unsubscribe(eventName: string, listener: any) {
    document.removeEventListener(eventName, listener);
  }
  
  function publish(eventName: string, data:any) {
    const event = new CustomEvent(eventName, { detail: data });
    document.dispatchEvent(event);
  }
  

const AppEvent = {
    subscribe,
    unsubscribe,
    publish
}

export default AppEvent;