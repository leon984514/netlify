import NextLink from 'next/link'
import {
  Link,
  Container,
  Heading,
  Box,
  SimpleGrid,
  Button,
  List,
  ListItem,
  useColorModeValue,
  chakra
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import Paragraph from '../components/paragraph'
import { BioSection, BioYear } from '../components/bio'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { GridItem } from '../components/grid-item'
import { IoLogoTwitter, IoLogoInstagram, IoLogoGithub } from 'react-icons/io5'
import Image from 'next/image'

import { useState, useEffect } from 'react';
import Router from 'next/router'

const Home = ({ wallet, connectWallet, games, web3, setGames, contract }) => {

  useEffect(() => {
    async function load() {
      if (window.ethereum) {
        const chainId = await window.ethereum.request({
          method: "eth_chainId"
        });
        if (chainId != 3) return;
        let lastGameId = await contract.methods.gameId().call();
        let len = Math.min(lastGameId, 8);
        let gameArray = [];
        for (let i = 0; i < len; i++) {
          let game = await contract.methods.games(lastGameId - i - 1).call();

          let currentTimeInSeconds = Math.floor(Date.now() / 1000);
          let duration = currentTimeInSeconds - game.time;
          if (duration < 60) {
            game.timeBar = duration.toString() + ' secs ago';
          } else {
            duration = Math.floor(duration / 60);
            if (duration < 60) {
              game.timeBar = duration.toString() + ' mins ago';
            } else {
              game.timeBar = 'hours ago';
            }
          }
          gameArray.push(game);
        }
        setGames(gameArray);
      }
    }

    load();
  }, []);

  const connectWalletClicked = () => {
    connectWallet();
  }

  const playClicked = () => {
    Router.push({
      pathname: '/betting',
    });
  }

  return (
    <Layout>
      <Container>
        <Box
          className='degenhound'
          m="auto"
          at={['-20px', '-60px', '-120px']}
          mb={['-40px', '-140px', '-200px']}
          w={[280, 480, 640]}
          h={[280, 480, 640]}
          position='relative'
          align="center"

        >
          <Image
            src="/images/houndsmoking.gif"
            size="s"
            position="absolute"
            width={450}
            height={450}
          />

        </Box>
        <Box
          borderRadius="lg"
          mb={6}
          p={3}
          textAlign="center"
          bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
          css={{ backdropFilter: 'blur(10px)' }}
        >
          Welcome to the Degen Hound Races!
      </Box>
        <Box align="center" my={4}>
          {
            wallet.length === 0 ? (
              <Button
                colorScheme="teal"
                onClick={connectWalletClicked}
              >
                Connect Wallet
            </Button>
            ) : (
                <Button
                  colorScheme="teal"
                  onClick={playClicked}
                >
                  Play Now
                </Button>
              )
          }
        </Box>
        <Box display={{ md: 'flex' }}>
          <Box
            flexGrow={1}
            textAlign="center"
          >
            <Heading as="h2" variant="page-title">
              RECENT PLAYS
            </Heading>
            {/* <hr style={{ marginTop: 10, marginBottom: 10, marginLeft: 60, marginRight: 60 }} /> */}
            <div
              className={games.length == 0 ? "" : "raceHistory"}
              bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
              css={{ backdropFilter: 'blur(10px)' }}>
              {
                games.map((game, index) => {
                  let addr = (game.player.length > 0 ? (
                    "Wallet (" +
                    String(game.player).substring(38) +
                    ')'
                  ) : '');

                  let amount = web3.utils.fromWei(game.amount);
                  let result = (game.winAmount == '0' ? 'got rugged' : 'doubled');

                  return (
                    <div key={index}>
                      <div className="hisData">
                        <Image
                          src="/images/eth.png"
                          size="s"
                          position="absolute"
                          width={25}
                          height={30}
                        />
                        <span>{addr} bet {amount} and </span>
                        <span>&nbsp;{result}</span>
                      </div>
                      {/* <span>45secs ago</span> */}
                      <span>{game.timeBar}</span>
                    </div>
                    // <p key={index}>{addr} bet {amount} and {result}</p>
                  )
                })
              }
            </div>
          </Box>
        </Box>

        <Section delay={0.1}>
          <Heading as="h3" variant="section-title">
            ABOUT US
          </Heading>
          <Paragraph>
            Degen Hounds is a {" "}
            <Link href="https://docs.chain.link/docs/chainlink-vrf/" target="_blank">
              Smart Contract
        </Link>
            {" "}that allows users to play Double or Nothing
            with their Ethereum tokens. Odds are 50/50 with a 5% fee, 3% of which is distributed
          to DH NFT holders in MATIC. Our Smart contract uses a brand-new way to generate
          True Randomness and we are nearly positive the exploit risk is almost eliminated. 
          The way it is developed is a tricky combination of a common way of using a keccak256 hash function and multiple 
          unpredictable values on the blockchain. There are billions of transactions in the blockchain generated each second, 
          and no one can 100% predict when a certain one will be processed and verified within a certain time. 
          So we use that information based on balances of multiple top Ethereum exchange accounts - 
          and these balances are changing almost every second.
        </Paragraph>


        </Section>
      </Container>
    </Layout>
  )
}

export default Home
export { getServerSideProps } from '../components/chakra'
