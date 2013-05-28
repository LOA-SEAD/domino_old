
define(["underscore"], function (_) {

    var subscribersMap = [],

    publish = function (subject, data) {
        var parameters = Array.prototype.slice.call(arguments, 1),
        subscribersData = fetchSubscribersFor(subject);

        if (subscribersData) {
            _(subscribersData.subscribers)
            .every(function (subscriber) {
                return subscriber.apply(this, parameters) !== false ? true : false;
            });
        }
    },

    subscribe = function (interest, subscriber) {
        var subscribersData = fetchSubscribersFor(interest);

        if (!subscribersData) {
            subscribersData = { interest: interest, subscribers: [] };
            subscribersMap.push(subscribersData);
        }

        subscribersData.subscribers.push(subscriber);
    },

fetchSubscribersFor = function (interest) {
    return _(subscribersMap)
.find(function (subscriber) {
    return subscriber.interest === interest;
});
},

    subscribeAll = function (interestsAndSubscribers) {
        _.chain(interestsAndSubscribers)
    .keys()
    .each(function (interest) {
        var subscriber = interestsAndSubscribers[interest];
        subscribe(interest, subscriber);
    });
    };

    return {
        publish: publish,
        subscribe: subscribe,
        subscribeAll: subscribeAll
    };

});
