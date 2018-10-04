<template>
  <div :class="[pageClass]">
    <ul>
      <li v-if="config.showPaginationList" class="disabled vPaginationList">
        <a>{{$t('Base_Page_PageLength')}}
          <select @change="switchLength" v-model="pageSize">
            <option v-for="len in lengthList" v-bind:key="len">{{len}}</option>
          </select>
        </a>
      </li>
      <li v-if="config.showPageInfo" class="disabled bPageInfo">
        <a>{{
          $t('Base_Page_PageInfo')
          .replace('#pageNumber#', currentPage)
          .replace('#totalPage#', totalPage)
          .replace('#totalRow#', totalRow)
          }}</a>
      </li>
      <li :class="{disabled:currentPage === 1,bPageControlButton:true} ">
        <a href="javascript:void(0);" @click="switchPage('first')">{{$t('Base_Page_First')}}</a>
      </li>
      <li :class="{disabled:currentPage === 1,bPageControlButton:true}">
        <a href="javascript:void(0);" @click="switchPage('previous')">{{$t('Base_Page_Prev')}}</a>
      </li>
      <li :class="{active:(num === currentPage)}" v-for="(num,index) in pageNumbers" v-bind:key="index">
        <a href="javascript:void(0);" @click="switchPage(num)">{{num}}</a>
      </li>
      <li :class="{bPageControlButton:true,disabled:currentPage === totalPage}">
        <a href="javascript:void(0);" @click="switchPage('next')">{{$t('Base_Page_Next')}}</a>
      </li>
      <li :class="{bPageControlButton:true,disabled:currentPage === totalPage}">
        <a href="javascript:void(0);" @click="switchPage('last')">{{$t('Base_Page_Last')}}</a>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  name: 'v-page',
  props: ['setting'],
  data () {
    const defaults = {
      totalRow: 0,
      pageSizeMenu: [10, 20, 50, 100],
      language: 'cn',
      align: 'right',
      showPaginationList: false,
      showPageInfo: false,
      goPage: 0
    }
    let config = Object.assign({}, defaults, this.setting)
    return {
      config: config,
      pageNumber: 1,
      pageSize: 10,
      totalRow: config.totalRow,
      totalPage: 0,
      currentPage: 1,
      lengthList: config.pageSizeMenu,
      pageNumberSize: 5,
      pageClass: {
        vPagination: true,
        vPaginationRight: false,
        vPaginationCenter: false
      }
    }
  },
  computed: {
    pageNumbers: function () {
      let start = []
      let end
      let nums = []
      let pNum = this.currentPage
      let half = Math.floor(this.pageNumberSize / 2)
      if (this.totalPage < this.pageNumberSize) {
        start = 1
        end = this.totalPage
      } else if (pNum <= half) {
        start = 1
        end = this.pageNumberSize
      } else if (pNum >= (this.totalPage - half)) {
        start = this.totalPage - this.pageNumberSize + 1
        end = this.totalPage
      } else {
        start = pNum - half
        end = start + this.pageNumberSize - 1
      }

      for (let i = start; i <= end; i++) {
        nums.push(i)
      }
      return nums
    }
  },
  watch: {
    currentPage: function (val) {
      this.goPage(val)
    },
    'setting.totalRow': function (val) {
      this.totalRow = val

      if (!this.lengthList.includes(this.pageSize)) {
        this.pageSize = this.lengthList[0]
      }
      this.calcTotalPage()
    },
    'setting.goPage': function (val) {
      if (val) {
        this.goPage(val)
      }
    }
  },
  methods: {
    goPage (pNum) {
      this.currentPage = pNum
      this.$emit('page-change', {
        pageNumber: pNum,
        pageSize: Number(this.pageSize)
      })
      this.calcTotalPage()
    },
    calcTotalPage () {
      this.totalPage = Math.ceil(this.totalRow / this.pageSize)
    },
    switchPage (pNum) {
      if (typeof (pNum) === 'string') {
        switch (pNum) {
          case 'first':
            if (this.currentPage !== 1) this.currentPage = 1
            break
          case 'previous':
            if (this.currentPage !== 1) this.currentPage--
            break
          case 'next':
            if (this.currentPage !== this.totalPage) this.currentPage++
            break
          case 'last':
            if (this.currentPage !== this.totalPage) this.currentPage = this.totalPage
            break
        }
      } else if (typeof (pNum) === 'number') {
        this.currentPage = pNum
      }
    },
    switchLength () {
      this.goPage(1)
    }
  },
  mounted () {
    if (this.config.align === 'center') { this.pageClass.vPaginationCenter = true } else if (this.config.align === 'right') { this.pageClass.vPaginationRight = true }
    this.goPage(1)
  }
}
</script>

<style lang="scss" scoped>
  $borderRadius: 2px;
  div.vPagination{
    margin: 0;display: block;
    &.vPaginationRight{ text-align: right; }
    &.vPaginationCenter{ text-align: center; }
    & > ul {
      display: inline-block;
      margin-bottom: 0;
      margin-left: 0;
      -webkit-border-radius: 0;
      -moz-border-radius: 0;
      border-radius: 0;
      -webkit-box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      -moz-box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      padding: 0;
      & > li {
        text-align: center;display: inline;box-sizing: border-box;margin: 0;
        & > a {
          margin: 0;
          border: 1px solid #dddddd;
          border-radius: 0;
          padding: 6px 12px;
          line-height: 20px;
          box-shadow: none;
          -moz-box-shadow: none;
          -webkit-box-shadow: none;
          background-color: white;

          float: left;
          text-decoration: none;

          border-left-width: 0;
          box-sizing: content-box;
          color: black;
          -webkit-transition: all .5s cubic-bezier(.175,.885,.32,1);
          transition: all .5s cubic-bezier(.175,.885,.32,1);
          &:hover {
            box-shadow: 0 0 12px rgba(0,0,0,0.2);
            -moz-box-shadow: 0 0 12px rgba(0,0,0,0.2);
            -webkit-box-shadow: 0 0 12px rgba(0,0,0,0.2);
          }
        }
        &.disabled > a {
          color: #999999;cursor: default;
          &:hover {
            color: #999999;background-color: white;box-shadow: none;
          }
        }
        &.active > a,
        &.active > span {
          cursor: default;color: #fff;background-color: #337ab7;
          &:hover { box-shadow: none; }
        }
        &:first-child > a,
        &:first-child > span {
          border-left-width: 1px;
          -webkit-border-bottom-left-radius: $borderRadius;
          border-bottom-left-radius: $borderRadius;
          -webkit-border-top-left-radius: $borderRadius;
          border-top-left-radius: $borderRadius;
          -moz-border-radius-bottomleft: $borderRadius;
          -moz-border-radius-topleft: $borderRadius;
        }
        &:last-child > a,
        &:last-child > span {
          -webkit-border-bottom-right-radius: $borderRadius;
          border-bottom-right-radius: $borderRadius;
          -webkit-border-top-right-radius: $borderRadius;
          border-top-right-radius: $borderRadius;
          -moz-border-radius-bottomright: $borderRadius;
          -moz-border-radius-topright: $borderRadius;
        }
        &.vPaginationList {
          a { line-height: 20px;height: 20px; }
          select{
            margin: -2px 0 0 5px;
            width: auto !important;
            vertical-align: middle;
            height: 22px;
            line-height: 22px;
            font-size: 12px;
            padding: 0;
            display: inline-block;
            border: 1px solid #CCCCCC;
            &:hover{
              box-shadow: 0 0 8px rgba(0,0,0,0.2);
              -moz-box-shadow: 0 0 8px rgba(0,0,0,0.2);
              -webkit-box-shadow: 0 0 8px rgba(0,0,0,0.2);
            }
          }
        }
      }
    }
  }
</style>
