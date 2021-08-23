const http = require('http');
const express = require("express");
const supertest = require('supertest');
const routes = require("../src/videoAPI");
const app = new express();
app.use("/", routes);

describe('User Endpoints', () => {

    it('GET /user/:vidId/:userId should return data', async () => {
        const res = await supertest(app).get("/video/1527/5")
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
        expect(res.body).toHaveProperty("videotime");
    });
  
});