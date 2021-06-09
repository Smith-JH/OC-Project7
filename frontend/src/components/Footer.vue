<template>
    <div class="footerContainer">
        <footer>
            <p id="footerText">{{ companyDetails }}</p>
        </footer>
    </div>
</template>

<script>
export default {
    name: 'Footer',
    data() {
        return {
            companyName: 'Groupomania:',
            appComponent: 'Internal-Media App - ',
        }
    },
    computed: {
        companyDetails() {
            const currentYear = new Date().getFullYear()
            return `${this.companyName} ${this.appComponent} ${currentYear}`
        }
    }
}
</script>

<style lang="scss">
.footerContainer {
    width: 95%;
    padding: 0.75rem;
    margin: 0 auto;
    footer {
        display: flex;
        align-content: center;
        justify-content: center;
        width: 100%;
        background: gray;
        #footerText {
            color: white;
            font-style: italic;
        }
    }
}
@media only screen and (min-width: 461px) and (max-width: 1024px) {
    footer > #footerText {
        font-size: 1.5em;
    }
}
</style>