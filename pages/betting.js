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

import { useEffect, useState } from 'react';
import Router from 'next/router';

const Betting = ({ wallet, web3, contract, contractAddress, balance, setBalance }) => {
    const [hound, setHound] = useState('');
    const [betAmount, setBetAmount] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (wallet.length == 0) {
            return Router.push('/');
        }
    }, [wallet]);

    const onGreyClicked = () => {
        setHound('grey');
    }

    const onOrangeClicked = () => {
        setHound('orange');
    }

    const onBetAmountClicked = (amount) => {
        setBetAmount(amount);
    }

    const onBetClicked = () => {
        if (hound.length == 0) {
            return alert('PLEASE SELECT WHAT YOU LIKE.');
        }
        if (betAmount == undefined) {
            return alert('PLEASE SELECT BET AMOUNT.');
        }

        let randomSeed = Math.floor(Math.random() * Math.floor(1e9));
        let bet = (hound === 'grey' ? 0 : 1);
        let amount = web3.utils.toWei(betAmount.toString());

        //Send bet to the contract and wait for the verdict
        contract.methods.game(bet, randomSeed).send({ from: wallet, value: amount }).on('transactionHash', (hash) => {
            setLoading(true);
            // contract.events.Result({}, async (error, event) => {
            contract.once('Result', {}, async (error, event) => {
                const verdict = event.returnValues.winAmount
                if (verdict === '0') {
                    alert('SORRY, UNFORTUNATELY YOU LOST :(')
                } else {
                    alert('CONGRATULATIONS! YOU WIN! :)')
                }

                //Prevent error when user logout, while waiting for the verdict
                if (wallet !== 'undefined' && wallet.length > 0) {
                    let balance = await web3.eth.getBalance(wallet);
                    balance = (Math.round(web3.utils.fromWei(balance) * 1000) / 1000).toFixed(3);
                    setBalance(balance);
                }
                setLoading(false);
            })
        }).on('error', (error) => {
            console.log('Error')
            setLoading(false);
        })
    }

    return (
        <Layout>
            <Container>
                {
                    loading ? (
                        <>
                            <div
                                style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}
                            >
                                <img
                                    src="/images/grey_running.gif"
                                    width={250}
                                    height={250}
                                />
                            </div>

                            <hr />
                            <div
                                style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}
                            >
                                <img
                                    src="/images/orange_running.gif"
                                    width={250}
                                    height={250}
                                />
                            </div>
                        </>
                    ) :
                        (
                            <>
                                <div
                                    style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }}
                                >
                                    <img
                                        src="/images/houndsmoking1.png"
                                        width={300}
                                        height={300}
                                    />
                                </div>

                                <Box
                                    borderRadius="lg"
                                    mb={6}
                                    p={3}
                                    textAlign="center"
                                    bg={useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')}
                                    css={{ backdropFilter: 'blur(10px)' }}
                                >
                                    Wallet Balance : {balance} ETH
                                </Box>

                                <Box display={{ md: 'flex' }}>
                                    <Box
                                        flexGrow={1}
                                        textAlign="center"
                                    >
                                        <p>I LIKE </p>
                                    </Box>
                                </Box>

                                <Box align="center" my={4}>
                                    <Button
                                        colorScheme={hound === 'grey' ? 'pink' : 'teal'}
                                        onClick={onGreyClicked}
                                    >
                                        GREY HOUND
                                    </Button>
                                    <Button
                                        colorScheme={hound === 'orange' ? 'pink' : 'teal'}
                                        style={{ marginLeft: 8 }}
                                        onClick={onOrangeClicked}
                                    >
                                        ORANGE HOUND
                                    </Button>
                                </Box>

                                <Box display={{ md: 'flex' }}>
                                    <Box
                                        flexGrow={1}
                                        textAlign="center"
                                    >
                                        <p>FOR</p>
                                    </Box>
                                </Box>

                                <Box align="center" my={4}>
                                    <Button
                                        colorScheme={betAmount == 0.01 ? 'pink' : 'teal'}
                                        onClick={() => onBetAmountClicked(0.01)}
                                    >
                                        0.01 ETH
                                    </Button>
                                    <Button
                                        colorScheme={betAmount == 0.025 ? 'pink' : 'teal'}
                                        style={{ marginLeft: 4 }}
                                        onClick={() => onBetAmountClicked(0.025)}
                                    >
                                        0.025 ETH
                                    </Button>
                                    <Button
                                        colorScheme={betAmount == 0.04 ? 'pink' : 'teal'}
                                        style={{ marginLeft: 4 }}
                                        onClick={() => onBetAmountClicked(0.04)}
                                    >
                                        0.04 ETH
                                    </Button>
                                </Box>

                                <Box align="center" my={4}>
                                    <Button
                                        colorScheme={betAmount == 0.05 ? 'pink' : 'teal'}
                                        onClick={() => onBetAmountClicked(0.05)}
                                    >
                                        0.05 ETH
                                    </Button>
                                    <Button
                                        colorScheme={betAmount == 0.065 ? 'pink' : 'teal'}
                                        style={{ marginLeft: 4 }}
                                        onClick={() => onBetAmountClicked(0.065)}
                                    >
                                        0.065 ETH
                                    </Button>
                                    <Button
                                        colorScheme={betAmount == 0.08 ? 'pink' : 'teal'}
                                        style={{ marginLeft: 4 }}
                                        onClick={() => onBetAmountClicked(0.08)}
                                    >
                                        0.08 ETH
                                    </Button>
                                </Box>

                                <Box align="center" my={4}>
                                    <hr />
                                </Box>

                                <Box align="center" my={4}>
                                    <Button
                                        colorScheme="teal"
                                        onClick={onBetClicked}
                                    >
                                        DOUBLE OR NOTHING
                                    </Button>
                                </Box>
                            </>
                        )
                }

            </Container>
        </Layout>
    )
}

export default Betting;
export { getServerSideProps } from '../components/chakra'
