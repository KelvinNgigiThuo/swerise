const ExpoKeepAwakeTag = 'owner-mobile-noop-keep-awake';

function useKeepAwake() {}

function activateKeepAwake() {}

function deactivateKeepAwake() {}

async function activateKeepAwakeAsync() {}

async function deactivateKeepAwakeAsync() {}

function addListener() {
  return {
    remove() {},
  };
}

function removeAllListeners() {}

module.exports = {
  ExpoKeepAwakeTag,
  useKeepAwake,
  activateKeepAwake,
  deactivateKeepAwake,
  activateKeepAwakeAsync,
  deactivateKeepAwakeAsync,
  addListener,
  removeAllListeners,
};
