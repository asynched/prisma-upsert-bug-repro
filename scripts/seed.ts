import { PrismaClient } from '@prisma/client'

async function seed() {
  const client = new PrismaClient()

  console.log('Creating user')
  const user = await client.user.create({
    data: {
      name: 'Jeffrey Danley',
      email: 'jeff@mail.com',
      username: 'Fireship',
      avatar:
        'https://yt3.googleusercontent.com/ytc/AIf8zZTUVa5AeFd3m5-4fdY2hEaKof3Byp8VruZ0f0FNEA=s100-c-k-c0x00ffffff-no-rj',
      password: 'password123',
      bio: 'High-intensity ⚡ code tutorials and tech news to help you ship your app faster. New videos every week covering the topics every programmer should know.',
    },
  })

  const videos = [
    {
      name: 'My browser, my paste.',
      url: '/static/videos/browser-paste.mp4',
      tags: ['Programming', 'Web Development', 'JavaScript'],
    },
    {
      name: 'Yo mama so FAT32',
      url: '/static/videos/file-types.mp4',
      tags: ['Programming', 'Operating Systems'],
    },
    {
      name: 'CSS in 3D',
      url: '/static/videos/pages-in-3d.mp4',
      tags: ['Programming', 'Web Development', 'CSS'],
    },
    {
      name: 'Web development in a nutshell',
      url: '/static/videos/story-of-web.mp4',
      tags: ['Programming', 'Web Development'],
    },
  ]

  for (const video of videos) {
    console.log('Creating video')
    const tags = await Promise.all(
      video.tags.map((name) =>
        client.tag.upsert({
          where: { name },
          update: {},
          create: { name },
        })
      )
    )

    const created = await client.video.create({
      data: {
        title: video.name,
        description: video.name,
        url: video.url,
        userId: user.id,
      },
    })

    console.log('Adding tags')
    await Promise.all(
      tags.map((tag) =>
        client.videoTag.create({ data: { videoId: created.id, tagId: tag.id } })
      )
    )
  }
}

seed()
