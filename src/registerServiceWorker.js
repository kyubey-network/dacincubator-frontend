/* eslint-disable no-console */
import { Notification, MessageBox } from 'element-ui';
import { register } from 'register-service-worker';

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log('App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB');
    },
    cached() {
      console.log('Content has been cached for offline use.');
    },
    updatefound() {
      console.log('New content is downloading.');
      Notification.info({
        title: '发现新版本',
        message: '正在后台更新应用，稍后静默安装，完成后提醒。',
      });
    },
    updated() {
      console.log('New content is available; please refresh.');
      MessageBox('为了修复已知 Bug，保障正常交易，请关闭所有 Kyubey IBO 网页，并重新打开以完成程序逻辑更新', '更新成功', {
        type: 'info',
        confirmButtonText: '确定',
        callback: (action) => {
          // skipWaiting()
        },
      });
    },
    offline() {
      console.log('No internet connection found. App is running in offline mode.');
    },
    error(error) {
      console.error('Error during service worker registration:', error);
    },
  });
}
