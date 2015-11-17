describe('firstTest', function () {

    //Arrange
    var counter;

    beforeEach(function () {
        counter = 0;
    });

    it('increment value', function () {
        //act
        counter++;

        //assert verify the result
        expect(counter).toEqual(1);
    });

    it('decrement value', function () {
        //act
        counter--;
        //assert
        expect(counter).toEqual(-1);
    });
});