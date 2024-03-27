const request = require('supertest');

host = 'http://localhost:5000'

describe('API tests', () => {
  it('GET /db/resume/read?user_id=1 should return 200', async () => {
    const res = await request(host).get('/db/resume/read?user_id=1');
    expect(res.statusCode).toEqual(200);
  });

  it('POST,PUT,DELETE: Full end-to-end', async () => {
    const post = await request(host).post('/db/resume/create').send({
        "title": "test resume",
        "user_id": 1,
        "sections": [
            {
                "entries": [
                    {
                        "bullets": [
                            {
                                "content": "",
                            }
                        ],
                        "title": ""
                    }
                ],
                "title": ""
            }
        ]
    });
    expect(post.statusCode).toEqual(200);
    expect(post.body.title).toEqual("test resume");

    let resume_id = post.body.resume_id
    const put = await request(host).put(`/db/resume/update?user_id=1&resume_id=${resume_id}`).send({
        "title": "test resume with new title",
        "user_id": 1,
        "sections": [
            {
                "entries": [
                    {
                        "bullets": [
                            {
                                "content": "",
                            }
                        ],
                        "title": ""
                    }
                ],
                "title": ""
            }
        ]
    });

    expect(put.statusCode).toEqual(200);
    expect(put.body.title).toEqual("test resume with new title")

    resume_id = put.body.resume_id
    const del = await request(host).delete(`/db/resume/delete?user_id=1&resume_id=${resume_id}`);
    expect(del.statusCode).toEqual(200);
  });

});