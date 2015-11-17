describe("Controller Test", function () {
    // Arrange
    var mockScope = {};
    var controller;
    var backend, mockInterval, mockTimeout, mockLog;
    beforeEach(angular.mock.module("testApp"));

    beforeEach(angular.mock.inject(function ($httpBackend) {
        backend = $httpBackend;
        backend.expect('GET', '/api/dataService/products').respond(
            [{ name: 'apple', category: 'fruit', price: 3.2 },
            { name: 'orange', category: 'fruit', price: 2.5 },
            { name: 'kiwi', category: 'fruit', price: 4.2 }]);
    }));

    beforeEach(angular.mock.inject(function ($controller, $rootScope,$http,$interval,$timeout,$log) {
        mockScope = $rootScope.$new();
        mockInterval = $interval;
        mockTimeout = $timeout;
        mockLog = $log;
        controller = $controller("unitTestController", {
            $scope: mockScope,
            $http: $http,
            $interval: mockInterval,
            $timeout: mockTimeout,
            $log: mockLog
        });
        backend.flush();
    }));
    
    // Act and Assess
    
    it("Creates variable", function () {
        expect(mockScope.counter).toEqual(0);
    })
    it("Increments counter", function () {
        mockScope.increment();
        expect(mockScope.counter).toEqual(1);
    });

    it('verify Ajax request', function () {
        backend.verifyNoOutstandingExpectation();
    });

    it('process the data', function () {
        expect(mockScope.products).toBeDefined();
        expect(mockScope.products.length).toEqual(3);
    });

    it('preserve the data orders', function () {
        expect(mockScope.products[0].name).toEqual('apple');
        expect(mockScope.products[1].price).toEqual(2.5);
    });

    it('limit interval timeout to 10 updates', function () {
        for (var i = 0; i < 11; i++) {
            mockInterval.flush(5000);
        }
        expect(mockScope.intervalCounter).toEqual(10);
    });

    it('increment timer counter', function () {
        mockTimeout.flush(5000);
        expect(mockScope.timerCounter).toEqual(1);
    });

    it('write log message', function () {
        expect(mockLog.log.logs.length).toEqual(1);
    });
});