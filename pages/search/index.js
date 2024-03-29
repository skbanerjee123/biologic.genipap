import fs from 'fs'
import matter from 'gray-matter'
import Link from 'next/link'
import path from 'path'
import { postFilePaths, POSTS_PATH } from '../../utils/mdxUtils'
import Head from "next/head"
import { Container } from "../../components/StyledContent"
import { SITENAME } from "../api/constants";
import { useRouter } from 'next/router'

export default function SearchTest({ posts }) {

  const { query } = useRouter();
  const q = query.q !== undefined ? query.q.toString().toLowerCase() : query.q
  console.log(q)
  const allPosts = posts.map(post => post.data.title)
  const allPostDesc = posts.map(post => post.data.description)
  const allTags = posts.map(post => post.data.tags)
  const searchQ = allTags.filter(post => post.toString().toLowerCase().includes(q)).length !== 0 ? allTags.filter(post => post.toString().toLowerCase().includes(q)) : allPosts.filter(post => post.toString().toLowerCase().includes(q)).length !== 0 ? allPosts.filter(post => post.toString().toLowerCase().includes(q)) : allPostDesc.filter(post => post.toString().toLowerCase().includes(q))
  const arrChk = allTags.filter(post => post.toString().toLowerCase().includes(q)).length !== 0 ? allTags : allPosts.filter(post => post.toString().toLowerCase().includes(q)).length !== 0 ? allPosts : allPostDesc
  console.log(searchQ)
  const noArtiFound = <div>
    <div className='text-center text-xl font-bold text-red-600'>No articles found!</div><div className='mt-6 text-teal-600 text-center'>Make an empty search to see all articles [A-Z]</div>
  </div>
  return (
    <>
      <Head>
        <title>Search:{query.q} - {SITENAME}</title>
      </Head>
      <Container>
        <div className="text-2xl md:text-3xl pb-6 border-b">Showing [A-Z] search results for <span className="text-teal-600 font-bold">{query.q}</span></div>
        <div className="mt-16 min-h-[50vh] max-w-xl">
          {searchQ.length !== 0 ?searchQ.map((item) => (
            <div className='first:mt-0 mt-12'>
              <Link href={`/article/${allPosts[arrChk.indexOf(item)].replace(/\s/g, '_')}`}>
                <a className='block max-w-fit text-sm text-teal-600'>{`https://biologic.genipap.tk/article/${allPosts[arrChk.indexOf(item)].replace(/\s/g, '_')}`}</a>
              </Link>
              <Link href={`/article/${item.replace(/\s/g, '_')}`}>
                <a className='text-blue-600 font-semibold block max-w-fit text-2xl mt-px hover:underline'>{allPosts[arrChk.indexOf(item)]}</a>
              </Link>
              <div className='mt-1 font-light text-neutral-600'>{allPostDesc[arrChk.indexOf(item)]}</div>
            </div>
          )) : noArtiFound}
        </div>
      </Container>
    </>
  )
}

export function getStaticProps() {
  const posts = postFilePaths.map((filePath) => {
    const source = fs.readFileSync(path.join(POSTS_PATH, filePath))
    const { content, data } = matter(source)

    return {
      content,
      data,
      filePath,
    }
  })

  return { props: { posts } }
}