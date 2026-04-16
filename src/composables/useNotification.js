import { ref } from 'vue';

const notifications = ref([]);

export function useNotification() {
  function showNotification(message, type = 'success') {
    const id = Date.now() + Math.random();
    const item = { id, message, type, visible: false };
    notifications.value.push(item);

    // 触发动画
    setTimeout(() => {
      item.visible = true;
    }, 50);

    // 自动移除
    setTimeout(() => {
      item.visible = false;
      setTimeout(() => {
        notifications.value = notifications.value.filter(n => n.id !== id);
      }, 400);
    }, 3000);
  }

  return { notifications, showNotification };
}
