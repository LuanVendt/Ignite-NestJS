import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { StudentFactory } from 'test/factories/make-student'
import { string } from 'zod'

describe('Upload attachments (E2E)', () => {
    let app: INestApplication
    let studentFactory: StudentFactory
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory],
        }).compile()

        app = moduleRef.createNestApplication()

        studentFactory = moduleRef.get(StudentFactory)
        jwt = moduleRef.get(JwtService)

        await app.init()
    })

    test('[POST] /attachments', async () => {
        const user = await studentFactory.makePrismaStudent()

        const accesToken = jwt.sign({ sub: user.id.toString() })

        const response = await request(app.getHttpServer())
            .post('/attachments')
            .set('Authorization', `Bearer ${accesToken}`)
            .attach('file', './test/e2e/sample-upload.jpg')

        expect(response.statusCode).toBe(201)
        expect(response.body).toEqual({
            attachmentId: expect.any(string),
        })
    })
})
