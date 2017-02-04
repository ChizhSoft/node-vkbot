var requestsCount = 11;

// String: ID паблика
var publicId      = "botsforchats";

// Узнаем, сколько друзей у бота
var friendsCount = API.friends.get({ count: 1 }).count;

// Получаем список юзеров, на которых бот подписан
var requestsOut = API.friends.getRequests({ count: 10, out: 1 }).items;

// Если исходящих заявок менее 10, то можно добавить больше друзей
if (requestsOut.length < 10) {
  requestsCount = requestsCount + (10 - requestsOut.length);
}

// Получаем список заявок в друзья
var requestsIn = API.friends.getRequests({ count: requestsCount, sort: 0 }).items;

// Рассчитаем, сколько друзей бот сможет принять
var acceptCount = 10000 + requestsOut.length - friendsCount;

// Отменяем исходящие заявки
while (requestsOut.length > 0) {
  API.friends.delete({ user_id: requestsOut.shift() });
}

// Если есть заявки в друзья..
if (requestsIn.length > 0) {
  // Проверяем условие "подписан на паблик" и добавляем в друзья. 
  // Те, кто условие не выполнил, будут отправлены в подписчики. 

  // Получаем список юзеров, которые подписаны на паблик
  var members = API.groups.isMember({ group_id: publicId, user_ids: requestsIn + "" });

  // Принимаем заявки в друзья, если юзер подписан
  while (acceptCount > 0 && members.length > 0) {
    var member = members.shift();
  
    if (member.member == 1) {
        // Принимаем заявку в друзья
        API.friends.add({ user_id: member.user_id });
        acceptCount = acceptCount - 1;
    } else {
        // Отклоняем заявку в друзья
        API.friends.delete({ user_id: member.user_id });
    }
  }
}

return "ok";