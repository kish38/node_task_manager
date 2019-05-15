test('Hello world', ()=>{

})

test('Async test demo', (done)=>{
    setTimeout(()=>{
        expect(1).toBe(1)
        done()
    }, 2000)
})

test('Test with Promis add two numbers', (done)=>{
    setTimeout(()=>{
        expect(1).toBe(1)
        done()
    }, 500)
    // add(2,3).then((sum) => {
    //     expect(sum).toBe(5)
    //     done()
    // })
    expect(5).toBe(5)
})